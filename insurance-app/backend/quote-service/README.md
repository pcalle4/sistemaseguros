# Quote Service

Microservicio NestJS para catálogos y cotizaciones de seguros con Prisma/PostgreSQL (`schema=quote`).

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL (puede levantarse con `docker compose` desde la raíz del monorepo)

## Variables de entorno

- `.env` para desarrollo
- `.env.test` para integración (`schema=quote_test`)
- `.env.example` como referencia

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:integration
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Migraciones y seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Para integración (usa `quote_test`):

```bash
npm run test:integration
```

## Endpoints

- `GET /catalogs/insurance-types`
- `GET /catalogs/coverages?insuranceType=AUTO`
- `GET /catalogs/locations`
- `POST /quotes`
- `GET /quotes/:id`
- Swagger: `GET /docs`
