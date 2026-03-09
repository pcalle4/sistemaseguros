# Insurance App Challenge

Evaluación Técnica para Desarrolladores Fullstack - Paul Calle

Todo el código ejecutable vive dentro de `insurance-app/`.

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, Zustand, React Hook Form, Zod
- API Gateway: NestJS, JWT, Swagger, Problem Details
- Quote Service: NestJS, Prisma, PostgreSQL
- Policy Service: NestJS, Prisma, PostgreSQL
- Base de datos: PostgreSQL 16

## Arquitectura del repo

```text
insurance-app/
  backend/
    api-gateway/     # http://localhost:3050
    quote-service/   # http://localhost:3060
    policy-service/  # http://localhost:3070
    shared/
  frontend/          # http://localhost:5173
  docker/
  docker-compose.yml
  scripts/
```

## Puertos

- Frontend: `5173`
- API Gateway: `3050`
- Quote Service: `3060`
- Policy Service: `3070`
- PostgreSQL: `5432`

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Variables de entorno

Cada app tiene su propio `.env.example`:

- `insurance-app/backend/api-gateway/.env.example`
- `insurance-app/backend/quote-service/.env.example`
- `insurance-app/backend/policy-service/.env.example`
- `insurance-app/frontend/.env.example`

Archivos de test incluidos:

- `insurance-app/backend/quote-service/.env.test`
- `insurance-app/backend/policy-service/.env.test`

Variables principales:

- API Gateway
  - `PORT=3050`
  - `JWT_SECRET=libelulasoft`
  - `JWT_EXPIRES_IN=1h`
  - `QUOTE_SERVICE_URL=http://localhost:3060`
  - `POLICY_SERVICE_URL=http://localhost:3070`
- Quote Service
  - `PORT=3060`
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insurance_db?schema=quote`
- Policy Service
  - `PORT=3070`
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insurance_db?schema=policy`
  - `QUOTE_SERVICE_URL=http://localhost:3060`
- Frontend
  - `VITE_API_BASE_URL=http://localhost:3050`

## Flujo local recomendado

Desde la carpeta `insurance-app/`:

```bash
cd insurance-app
docker compose up -d postgres
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Eso deja:

- PostgreSQL corriendo en `localhost:5432`
- API Gateway con CORS habilitado para `http://localhost:5173`
- Quote Service y Policy Service listos con Swagger y health checks
- Frontend consumiendo el gateway real sin proxy adicional

## Scripts principales

Desde `insurance-app/`:

```bash
npm run dev
npm run dev:full
npm run backend:setup
npm run backend:up
npm run frontend:up
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run lint
npm run test
npm run build
```

Qué hace cada uno:

- `npm run dev`: levanta gateway, quote-service, policy-service y frontend. Asume PostgreSQL ya corriendo.
- `npm run dev:full`: levanta también PostgreSQL con `docker compose`.
- `npm run backend:setup`: instala, prepara PostgreSQL, genera Prisma, migra y seed sin dejar servicios corriendo.
- `npm run backend:up`: mismo flujo anterior y además deja el backend corriendo.
- `npm run frontend:up`: instala si hace falta y levanta el frontend.
- `npm run prisma:generate`: genera los clientes Prisma de quote y policy.
- `npm run prisma:migrate`: aplica migraciones de quote y policy.
- `npm run prisma:seed`: ejecuta el seed de quote-service y el seed no-op de policy-service.
- `npm run test`: ejecuta tests unitarios, e2e e integración.

## Script maestro de backend

Si se requiere preparar y arrancar el backend con un solo comando:

```bash
cd insurance-app
npm run backend:up
```

El script:

- crea `.env` faltantes desde sus `.env.example`
- instala dependencias del monorepo
- reutiliza PostgreSQL si `localhost:5432` ya está ocupado por un Postgres válido
- si no existe, levanta PostgreSQL con Docker
- asegura la base `insurance_db`
- asegura los schemas `quote` y `policy`
- genera clientes Prisma
- aplica migraciones
- ejecuta seed
- arranca `api-gateway`, `quote-service` y `policy-service`

Para preparar el entorno sin dejar procesos vivos:

```bash
npm run backend:setup
```

Si se requiere omitir `npm install`:

```bash
bash ./scripts/start-backend.sh --skip-install
```

## Script maestro de frontend

```bash
cd insurance-app
npm run frontend:up
```

Hace esto:

- crea `frontend/.env` si falta
- instala dependencias si hace falta
- levanta Vite en `http://localhost:5173`

## Endpoints útiles

### Frontend

- `http://localhost:5173/login`

### Health

- `GET http://localhost:3050/health`
- `GET http://localhost:3060/health`
- `GET http://localhost:3070/health`

### Swagger

- `http://localhost:3050/docs`
- `http://localhost:3060/docs`
- `http://localhost:3070/docs`

## Flujo funcional esperado

1. Iniciar sesión en `frontend` con `user@example.com / password`
2. Cotizar seguro desde el frontend contra el API Gateway
3. Ver breakdown y prima estimada
4. Emitir póliza autenticada con JWT
5. Consultar policy ya emitida
6. Imprimir la cotización a PDF desde la UI

## Testing

El proyecto incluye:

- tests del API Gateway
- tests unitarios e integración de `quote-service`
- tests unitarios e integración de `policy-service`
- tests del frontend con Vitest y Testing Library

Los tests de integración usan schemas separados:

- `quote_test`
- `policy_test`

## CI

Se incluye workflow real en:

- `.github/workflows/ci.yml`

Pipeline:

1. checkout
2. setup node con cache npm
3. `npm ci`
4. lint
5. PostgreSQL de CI
6. `npm run prisma:generate`
7. `npm run prisma:migrate`
8. `npm run prisma:seed`
9. `npm run test`
10. `npm run build`

## Docker

El `docker-compose.yml` del proyecto expone únicamente PostgreSQL y ahora incluye `healthcheck`.

```bash
cd insurance-app
docker compose up -d postgres
docker compose ps
```

## Notas de integración

- El API Gateway es la única API pública del sistema.
- CORS del gateway permite `http://localhost:5173` y `http://127.0.0.1:5173`.
- El frontend envía `Authorization: Bearer ...` automáticamente cuando existe sesión.
- `quote-service` y `policy-service` no exponen auth propia; el control de acceso público/protegido vive en el gateway.
- Los tres backends exponen Swagger en `/docs`.

## Entrega rápida

Si se requiere validar rápidamente que todo está sano:

```bash
cd insurance-app
docker compose up -d postgres
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run test
npm run build
npm run dev
```
