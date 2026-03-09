#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTGRES_CONTAINER="insurance-postgres"
POSTGRES_CLIENT_IMAGE="postgres:16"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
DB_NAME="insurance_db"
DB_USER="postgres"
DB_PASSWORD="postgres"
SETUP_ONLY="false"
SKIP_INSTALL="false"
ACTIVE_POSTGRES_CONTAINER=""
ALLOW_INSECURE_PRISMA_TLS="${ALLOW_INSECURE_PRISMA_TLS:-true}"

log() {
  printf '[backend] %s\n' "$1"
}

fail() {
  printf '[backend] Error: %s\n' "$1" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "No se encontro el comando requerido: $1"
  fi
}

resolve_absolute_path() {
  local target_path="$1"

  (
    cd "$(dirname "$target_path")"
    printf '%s/%s\n' "$(pwd)" "$(basename "$target_path")"
  )
}

configure_tls() {
  if [[ -z "${NODE_EXTRA_CA_CERTS:-}" ]]; then
    if [[ "$ALLOW_INSECURE_PRISMA_TLS" == "true" ]]; then
      log 'No se definio NODE_EXTRA_CA_CERTS; Prisma usara TLS inseguro solo para este ejemplo'
    fi
    return
  fi

  if [[ ! -f "$NODE_EXTRA_CA_CERTS" ]]; then
    fail "NODE_EXTRA_CA_CERTS apunta a un archivo inexistente: $NODE_EXTRA_CA_CERTS"
  fi

  NODE_EXTRA_CA_CERTS="$(resolve_absolute_path "$NODE_EXTRA_CA_CERTS")"
  export NODE_EXTRA_CA_CERTS

  if [[ -z "${NPM_CONFIG_CAFILE:-}" ]]; then
    export NPM_CONFIG_CAFILE="$NODE_EXTRA_CA_CERTS"
  fi

  log "Usando CA adicional desde $NODE_EXTRA_CA_CERTS"
}

postgres_port_is_busy() {
  lsof -iTCP:"$POSTGRES_PORT" -sTCP:LISTEN -Pn >/dev/null 2>&1
}

detect_published_postgres_container() {
  docker ps --filter "publish=$POSTGRES_PORT" --format '{{.Names}}' | head -n 1
}

resolve_postgres_connection() {
  ACTIVE_POSTGRES_CONTAINER="$(detect_published_postgres_container)"

  if [[ -n "$ACTIVE_POSTGRES_CONTAINER" ]]; then
    local container_image

    container_image="$(docker inspect --format '{{.Config.Image}}' "$ACTIVE_POSTGRES_CONTAINER" 2>/dev/null || true)"
    if [[ -n "$container_image" ]]; then
      POSTGRES_CLIENT_IMAGE="$container_image"
    fi

    log "Reutilizando PostgreSQL existente en el contenedor $ACTIVE_POSTGRES_CONTAINER"
    return 0
  fi

  if postgres_port_is_busy; then
    log "El puerto $POSTGRES_PORT ya esta en uso; verificando PostgreSQL existente en $POSTGRES_HOST:$POSTGRES_PORT"
    return 0
  fi

  log 'Levantando PostgreSQL con Docker'
  run_in_app docker compose up -d --quiet-pull postgres
  ACTIVE_POSTGRES_CONTAINER="$POSTGRES_CONTAINER"
}

postgres_ready() {
  if [[ -n "$ACTIVE_POSTGRES_CONTAINER" ]]; then
    docker exec "$ACTIVE_POSTGRES_CONTAINER" pg_isready -U "$DB_USER" -d postgres >/dev/null 2>&1
    return
  fi

  docker run --rm \
    -e PGPASSWORD="$DB_PASSWORD" \
    "$POSTGRES_CLIENT_IMAGE" \
    pg_isready \
    -h host.docker.internal \
    -p "$POSTGRES_PORT" \
    -U "$DB_USER" \
    -d postgres >/dev/null 2>&1
}

run_psql() {
  local database="$1"
  local sql="$2"

  if [[ -n "$ACTIVE_POSTGRES_CONTAINER" ]]; then
    docker exec "$ACTIVE_POSTGRES_CONTAINER" psql -U "$DB_USER" -d "$database" -v ON_ERROR_STOP=1 -tAc "$sql"
    return
  fi

  docker run --rm \
    -e PGPASSWORD="$DB_PASSWORD" \
    "$POSTGRES_CLIENT_IMAGE" \
    psql \
    -h host.docker.internal \
    -p "$POSTGRES_PORT" \
    -U "$DB_USER" \
    -d "$database" \
    -v ON_ERROR_STOP=1 \
    -tAc "$sql"
}

create_database() {
  if [[ -n "$ACTIVE_POSTGRES_CONTAINER" ]]; then
    docker exec "$ACTIVE_POSTGRES_CONTAINER" createdb -U "$DB_USER" "$DB_NAME"
    return
  fi

  docker run --rm \
    -e PGPASSWORD="$DB_PASSWORD" \
    "$POSTGRES_CLIENT_IMAGE" \
    createdb \
    -h host.docker.internal \
    -p "$POSTGRES_PORT" \
    -U "$DB_USER" \
    "$DB_NAME"
}

ensure_env_file() {
  local service_dir="$1"
  local env_file="$service_dir/.env"
  local example_file="$service_dir/.env.example"

  if [[ ! -f "$env_file" ]]; then
    if [[ ! -f "$example_file" ]]; then
      fail "Falta el archivo de ejemplo: $example_file"
    fi

    cp "$example_file" "$env_file"
    log "Creado $env_file desde .env.example"
  fi
}

wait_for_postgres() {
  local attempt

  for attempt in $(seq 1 60); do
    if postgres_ready; then
      return 0
    fi

    sleep 1
  done

  if [[ -n "$ACTIVE_POSTGRES_CONTAINER" ]]; then
    fail 'PostgreSQL no estuvo listo a tiempo'
  fi

  fail "El servicio en $POSTGRES_HOST:$POSTGRES_PORT no responde como PostgreSQL"
}

ensure_database() {
  local db_exists

  db_exists="$(run_psql postgres "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")"

  if [[ "$db_exists" != "1" ]]; then
    log "Creando base de datos $DB_NAME"
    create_database
  else
    log "Base de datos $DB_NAME ya existe"
  fi

  log 'Verificando schemas quote y policy'
  run_psql "$DB_NAME" "CREATE SCHEMA IF NOT EXISTS quote; CREATE SCHEMA IF NOT EXISTS policy;" >/dev/null
}

run_in_app() {
  (
    cd "$APP_DIR"
    "$@"
  )
}

run_app_command() {
  local description="$1"
  local log_file
  local exit_code

  shift
  log "$description"
  log_file="$(mktemp)"

  set +e
  (
    cd "$APP_DIR"
    "$@"
  ) 2>&1 | tee "$log_file"
  exit_code=${PIPESTATUS[0]}
  set -e

  if [[ "$exit_code" -eq 0 ]]; then
    rm -f "$log_file"
    return 0
  fi

  if grep -Eqi 'self-signed certificate in certificate chain|unable to get local issuer certificate|UNABLE_TO_GET_ISSUER_CERT_LOCALLY' "$log_file"; then
    rm -f "$log_file"
    fail "Fallo TLS durante '$description'. Exporta NODE_EXTRA_CA_CERTS=/ruta/ca.pem o define ALLOW_INSECURE_PRISMA_TLS=true y vuelve a correr npm run backend:up"
  fi

  rm -f "$log_file"
  fail "Fallo en '$description'"
}

run_prisma_command() {
  local description="$1"

  shift
  if [[ -z "${NODE_EXTRA_CA_CERTS:-}" && "$ALLOW_INSECURE_PRISMA_TLS" == "true" ]]; then
    run_app_command "$description" env NODE_TLS_REJECT_UNAUTHORIZED=0 "$@"
    return
  fi

  run_app_command "$description" "$@"
}

print_usage() {
  cat <<'EOF'
Uso:
  bash ./scripts/start-backend.sh [--setup-only] [--skip-install]

Opciones:
  --setup-only   Instala/prepara todo pero no deja los servicios corriendo.
  --skip-install Omite npm install.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --setup-only)
      SETUP_ONLY="true"
      ;;
    --skip-install)
      SKIP_INSTALL="true"
      ;;
    --help|-h)
      print_usage
      exit 0
      ;;
    *)
      fail "Argumento no soportado: $arg"
      ;;
  esac
done

require_command npm
require_command docker
require_command lsof

if ! docker info >/dev/null 2>&1; then
  fail 'Docker no esta disponible o el daemon no esta levantado'
fi

if ! docker compose version >/dev/null 2>&1; then
  fail 'docker compose no esta disponible'
fi

configure_tls

ensure_env_file "$APP_DIR/backend/api-gateway"
ensure_env_file "$APP_DIR/backend/quote-service"
ensure_env_file "$APP_DIR/backend/policy-service"

if [[ "$SKIP_INSTALL" != "true" ]]; then
  run_app_command 'Instalando dependencias npm del monorepo' npm install --no-fund --no-audit
else
  log 'Omitiendo npm install'
fi

resolve_postgres_connection

log 'Esperando a PostgreSQL'
wait_for_postgres
ensure_database

run_prisma_command 'Generando clientes Prisma' npm run prisma:generate

run_prisma_command 'Aplicando migraciones de quote-service' npm run prisma:migrate --workspace backend/quote-service

run_prisma_command 'Ejecutando seed de quote-service' npm run prisma:seed --workspace backend/quote-service

run_prisma_command 'Aplicando migraciones de policy-service' npm run prisma:migrate --workspace backend/policy-service

if [[ "$SETUP_ONLY" == "true" ]]; then
  log 'Preparacion completada'
  exit 0
fi

log 'Levantando backend: api-gateway (3050), quote-service (3060), policy-service (3070)'
cd "$APP_DIR"
exec npx concurrently \
  -k \
  -n gateway,quote,policy \
  -c cyan,green,magenta \
  "npm run dev --workspace backend/api-gateway" \
  "npm run dev --workspace backend/quote-service" \
  "npm run dev --workspace backend/policy-service"
