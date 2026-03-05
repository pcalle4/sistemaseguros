# insurance-app

Evaluación Técnica para Desarrolladores Fullstack - Paul Calle

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Estructura

- `backend/api-gateway` (NestJS, puerto 3050)
- `backend/quote-service` (NestJS + Prisma, puerto 3060)
- `backend/policy-service` (NestJS + Prisma, puerto 3070)
- `backend/shared` (paquete TypeScript compartido)
- `frontend` (React + Vite + Tailwind, puerto 5173)
- `docker/postgres` (init de PostgreSQL)

## Instalación

```bash
npm install
```

## Base de datos (Docker)

```bash
npm run dev:db
```

PostgreSQL queda disponible en `localhost:5432` con:

- user: `postgres`
- password: `postgres`
- db: `insurance_db`
- schemas: `quote`, `policy`

## Desarrollo (todo junto)

```bash
npm run dev
```

Levanta PostgreSQL + API Gateway + Quote Service + Policy Service + Frontend.

## Scripts raíz

- `npm run lint`
- `npm run test`
- `npm run build`

## Variables de entorno

Cada app incluye `.env.example` y `.env`:

- `backend/api-gateway/.env`
- `backend/quote-service/.env`
- `backend/policy-service/.env`
- `frontend/.env`

## Endpoints base

- API Gateway Health: `http://localhost:3050/health`
- Quote Service Health: `http://localhost:3060/health`
- Policy Service Health: `http://localhost:3070/health`
- Swagger API Gateway: `http://localhost:3050/docs`
- Swagger Quote Service: `http://localhost:3060/docs`
- Swagger Policy Service: `http://localhost:3070/docs`
- Frontend: `http://localhost:5173`
