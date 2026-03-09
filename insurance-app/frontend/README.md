# Frontend

SPA en React + TypeScript + TailwindCSS para consumir el API Gateway real del proyecto.

## Requisitos

- Node.js 20+
- API Gateway corriendo en `http://localhost:3050`

## Configuración

Se puede crear `frontend/.env` a partir de `.env.example` si se requiere cambiar la URL:

```bash
VITE_API_BASE_URL=http://localhost:3050
```

## Ejecutar

Desde `insurance-app/`:

```bash
npm run frontend:up
```

Si las dependencias ya están instaladas y se requiere omitir `npm install`:

```bash
bash ./scripts/start-frontend.sh --skip-install
```

Frontend:

- `http://localhost:5173`

## Flujo principal

1. Se accede a `http://localhost:5173/login` y se autentica la sesión con `user@example.com / password`.
2. Tras un login exitoso, el frontend redirige a la pantalla protegida de cotización.
3. Carga catálogos reales desde el gateway.
4. Permite cotizar seguro con tipo, cobertura, edad y ubicación.
5. Muestra prima estimada y breakdown.
6. Emite una póliza usando el token JWT del gateway.

## Integración con el gateway

Consume estos endpoints a través de `VITE_API_BASE_URL`:

- `GET /catalogs/insurance-types`
- `GET /catalogs/coverages?insuranceType=...`
- `GET /catalogs/locations`
- `POST /quotes`
- `GET /quotes/:id`
- `POST /auth/login`
- `POST /policies`
- `GET /policies/:id`

## Scripts

Desde `insurance-app/`:

- `npm run frontend:up`
- `npm run dev --workspace frontend`
- `npm run build --workspace frontend`
- `npm run test --workspace frontend`
- `npm run lint --workspace frontend`
