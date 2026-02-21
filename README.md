# Historial Digital de Vehículos (MVP v1.0)

Producto web mobile-first para historial vehicular en Uruguay/Sudamérica sin APIs oficiales.

## Stack
- `apps/web`: Next.js App Router + TypeScript + Tailwind + Auth.js + Prisma + Postgres
- `packages/shared`: esquemas Zod y tipos compartidos
- Ledger permissioned blockchain-like:
  - Canonical JSON + SHA-256 payload hash
  - Hash chain (`prevHash -> entryHash`)
  - Firma por entrada (`ed25519`)
  - Batches con Merkle root + proof
  - Endpoints de verificación/auditoría

## Estructura
- `apps/web/app` UI + API routes
- `apps/web/lib/ledger` núcleo criptográfico
- `apps/web/prisma/schema.prisma` modelo de datos
- `apps/web/prisma/seed.ts` seed inicial
- `docker-compose.yml` Postgres local
- `scripts/dev.sh` flujo dev en una línea

## Quick start (local, <5 minutos)
1. Copiar env:
   ```bash
   cp .env.example .env
   cp .env.example apps/web/.env
   ```
2. Instalar deps:
   ```bash
   npm install
   ```
3. Levantar DB:
   ```bash
   docker compose up -d postgres
   ```
4. Migrar + seed:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```
5. Ejecutar app:
   ```bash
   npm run dev
   ```

## Endpoints MVP
### Core
- `POST /api/vehicles`
- `GET /api/vehicles`
- `GET /api/vehicles/:id`
- `POST /api/vehicles/:id/events`
- `GET /api/vehicles/:id/events?type=&verification=`
- `POST /api/vehicles/:id/share-links`
- `GET /api/public/vehicles/:token`

### Ledger
- `GET /api/ledger/verify?eventId=...`
- `GET /api/ledger/audit?from=...&to=...`

### Dealer
- `POST /api/dealer/profile`
- `POST /api/dealer/vehicles/:id/events`

### Admin
- `GET /api/admin/flags`
- `POST /api/admin/dealers/:id/verify`
- `POST /api/admin/share-links/:id/revoke`

## Verificación criptográfica externa
1. Obtener prueba:
   - `GET /api/ledger/verify?eventId=<id>`
2. Verificar en orden:
   - `payloadHash` coincide con JSON canónico del evento + hashes de adjuntos.
   - `entryHash` coincide con `sha256(prevHash|payloadHash|timestamp|entityType|entityId)`.
   - `signature` valida con `publicKey` (ed25519).
   - `merkle.proof` reconstruye `merkleRoot` del batch.

## Reglas de producto implementadas
- Inmutabilidad: no existe endpoint de edición de eventos.
- Correcciones: `type=CORRECTION` + `correctionOfEventId`.
- Odometer rollback: permitido, pero flag automático `needsClarification` + admin flag.
- Rate limit eventos: 10/hora por usuario.
- Badges determinísticos:
  - `TRANSPARENT_OWNER`
  - `MAINTENANCE_STREAK`
  - `RECENT_SERVICE`
  - `LOW_RISK` (indicativo)

## Tests
- Unit:
  - canonical hashing
  - hash chain + signatures
  - merkle proof
  - badge logic
- Integration smoke:
  - consistencia flujo hash chain + merkle
- E2E:
  - landing CTA crítico

Comandos:
```bash
npm run test
npm run test:e2e
npm run lint
npm run typecheck
```

## Deploy (MVP)
### Vercel
1. Crear Postgres gestionado (Neon/Supabase/RDS).
2. Configurar env vars de `.env.example`.
3. `npm run db:migrate` en CI o predeploy.
4. Deploy del workspace `apps/web`.

### Render/Fly
- Usar Dockerfile simple (no incluido) o buildpacks Node.
- Mantener `DATABASE_URL` y `AUTH_SECRET` seguros.

## Trust & Limits (UI)
- “Esto no reemplaza inspección mecánica.”
- “Eventos pueden estar incompletos si no se registraron.”
- “Próximamente: verificación por talleres/aseguradoras.”
