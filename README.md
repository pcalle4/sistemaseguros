# insurance-app

Evaluación Técnica para Desarrolladores Fullstack - Paul Calle

## Estructura del repo

Este repositorio tiene el código dentro de `insurance-app/`:

- `insurance-app/backend/api-gateway` (NestJS, puerto `3050`)
- `insurance-app/backend/quote-service` (NestJS + Prisma, puerto `3060`, schema `quote`)
- `insurance-app/backend/policy-service` (NestJS + Prisma, puerto `3070`, schema `policy`)
- `insurance-app/backend/shared` (paquete TypeScript compartido)
- `insurance-app/frontend` (React + Vite + Tailwind, puerto `5173`)
- `insurance-app/docker/postgres` (init SQL de PostgreSQL)

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Instalación

```bash
cd insurance-app
npm install
```

`npm install` no ejecuta `prisma generate` automáticamente. Después de instalar dependencias, genera los clientes Prisma de forma explícita:

```bash
npm run prisma:generate
```

## Script Maestro Para Backend

Si quieres dejar el backend listo con un solo comando, usa el script maestro desde `insurance-app/`:

```bash
npm run backend:up
```

Ese comando hace lo siguiente:

- crea `backend/api-gateway/.env`, `backend/quote-service/.env` y `backend/policy-service/.env` si faltan
- ejecuta `npm install` del monorepo
- si `localhost:5432` ya esta ocupado, verifica si responde como PostgreSQL y lo reutiliza; si no, levanta PostgreSQL con Docker
- verifica que exista la base `insurance_db` y crea los schemas `quote` y `policy` si faltan
- ejecuta `prisma generate`
- aplica migraciones de `quote-service` y `policy-service`
- ejecuta el seed de `quote-service`
- deja corriendo:
  - API Gateway en `http://localhost:3050`
  - Quote Service en `http://localhost:3060`
  - Policy Service en `http://localhost:3070`

Si solo quieres preparar el entorno sin dejar procesos corriendo:

```bash
npm run backend:setup
```

Si ya instalaste dependencias y quieres invocar el script directo:

```bash
bash ./scripts/start-backend.sh --skip-install
```

Por defecto, para este ejemplo, el script permite descargas Prisma con TLS inseguro si no defines una CA adicional.

Si prefieres usar una CA corporativa o un proxy TLS confiable, ejecútalo así:

```bash
NODE_EXTRA_CA_CERTS=/ruta/ca.pem npm run backend:up
```

El script reutiliza ese certificado para `npm install` y comandos Prisma.

Si quieres desactivar el fallback inseguro y obligar validación TLS normal:

```bash
ALLOW_INSECURE_PRISMA_TLS=false npm run backend:up
```

Supuestos del script:

- si reutiliza un PostgreSQL ya corriendo en `localhost:5432`, debe aceptar las credenciales configuradas por el proyecto: `postgres/postgres`
- si usas `NODE_EXTRA_CA_CERTS`, la ruta debe apuntar a un archivo `.pem` válido accesible desde tu máquina
- si no defines `NODE_EXTRA_CA_CERTS`, el script usará `NODE_TLS_REJECT_UNAUTHORIZED=0` solo para comandos Prisma

## Variables de entorno

Cada app tiene `.env.example` (copiar a `.env`):

- `insurance-app/backend/api-gateway/.env.example`
- `insurance-app/backend/quote-service/.env.example`
- `insurance-app/backend/policy-service/.env.example`
- `insurance-app/frontend/.env.example`

Variables clave:

- API Gateway:
  - `PORT=3050`
  - `QUOTE_SERVICE_URL=http://localhost:3060`
  - `POLICY_SERVICE_URL=http://localhost:3070`
- Quote Service:
  - `PORT=3060`
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insurance_db?schema=quote`
- Policy Service:
  - `PORT=3070`
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insurance_db?schema=policy`
  - `QUOTE_SERVICE_URL=http://localhost:3060`
- Frontend:
  - `VITE_API_BASE_URL=http://localhost:3050`

## Base de datos (Docker)

Desde `insurance-app/`:

```bash
npm run dev:db
```

PostgreSQL:

- host: `localhost`
- port: `5432`
- user: `postgres`
- password: `postgres`
- database: `insurance_db`
- schemas usados:
  - `quote`
  - `policy`

## Desarrollo

Desde `insurance-app/`:

```bash
npm run dev
```

Para backend solamente, usa preferentemente:

```bash
npm run backend:up
```

Levanta en paralelo:

- postgres
- api-gateway
- quote-service
- policy-service
- frontend

## Scripts principales

Desde `insurance-app/`:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run prisma:generate`

Por servicio (ejemplos):

```bash
npm run dev --workspace backend/quote-service
npm run test:integration --workspace backend/quote-service
npm run dev --workspace backend/policy-service
npm run test:integration --workspace backend/policy-service
```

## Migraciones Prisma

Quote Service:

```bash
cd insurance-app/backend/quote-service
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Policy Service:

```bash
cd insurance-app/backend/policy-service
npm run prisma:generate
npm run prisma:migrate
```

## Endpoints base

### Infra

- Frontend: `http://localhost:5173`
- API Gateway: `http://localhost:3050`
- Quote Service: `http://localhost:3060`
- Policy Service: `http://localhost:3070`

### Health

- API Gateway: `GET http://localhost:3050/health`
- Quote Service: `GET http://localhost:3060/health`
- Policy Service: `GET http://localhost:3070/health`

### Swagger

- API Gateway docs: `http://localhost:3050/docs`
- Quote Service docs: `http://localhost:3060/docs`
- Policy Service docs: `http://localhost:3070/docs`

### Quote Service

- `GET /catalogs/insurance-types`
- `GET /catalogs/coverages?insuranceType=AUTO`
- `GET /catalogs/locations`
- `POST /quotes`
- `GET /quotes/:id`

### Policy Service

- `POST /policies`
- `GET /policies/:id`

## Notas

- No hay autenticación implementada aún en `quote-service` ni `policy-service`.
- `policy-service` valida existencia de quote vía HTTP interno a `quote-service`.
- Tests de integración usan schemas aislados:
  - quote: `quote_test`
  - policy: `policy_test`
