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
