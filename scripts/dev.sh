#!/usr/bin/env bash
set -euo pipefail
docker compose up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
