#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKIP_INSTALL="false"

log() {
  printf '[frontend] %s\n' "$1"
}

fail() {
  printf '[frontend] Error: %s\n' "$1" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "No se encontro el comando requerido: $1"
  fi
}

ensure_env_file() {
  local env_file="$APP_DIR/frontend/.env"
  local example_file="$APP_DIR/frontend/.env.example"

  if [[ ! -f "$env_file" ]]; then
    if [[ ! -f "$example_file" ]]; then
      fail "Falta el archivo de ejemplo: $example_file"
    fi

    cp "$example_file" "$env_file"
    log "Creado $env_file desde .env.example"
  fi
}

print_usage() {
  cat <<'EOF'
Uso:
  bash ./scripts/start-frontend.sh [--skip-install]

Opciones:
  --skip-install Omite npm install.
EOF
}

for arg in "$@"; do
  case "$arg" in
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
ensure_env_file

cd "$APP_DIR"

if [[ "$SKIP_INSTALL" != "true" ]]; then
  log 'Instalando dependencias npm del monorepo'
  npm install --no-fund --no-audit
else
  log 'Omitiendo npm install'
fi

log 'Levantando frontend en http://localhost:5173'
exec npm run dev --workspace frontend
