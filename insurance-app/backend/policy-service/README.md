# Policy Service

Microservicio NestJS para emisión y consulta de pólizas con Prisma/PostgreSQL (`schema=policy`).

## Variables de entorno

- `PORT=3070`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insurance_db?schema=policy`
- `QUOTE_SERVICE_URL=http://localhost:3060`

Para tests de integración se utiliza `schema=policy_test` en `.env.test`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:integration
npm run prisma:generate
npm run prisma:migrate
```

## Endpoints

- `POST /policies`
- `GET /policies/:id`
- `GET /health`
- Swagger: `GET /docs`
