# Blood Bridge

Blood Bridge is an intelligent blood bank and donation management platform connecting donors, hospitals, and blood banks in real time.

## Setup

```
npm install
```

## Run & Operate

- `npm run dev` — run the Blood Bridge frontend (http://localhost:5173)
- `npm run dev:api` — run the API server (port 5000) — requires `DATABASE_URL`
- `npm run typecheck` — full typecheck across all packages
- `npm run build` — typecheck + build all packages
- `npm run codegen --workspace=@workspace/api-spec` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `npm run push --workspace=@workspace/db` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (only needed for `dev:api`)

## Project Structure

```
blood-bridge/
├── apps/
│   ├── blood-bridge/      # React + Vite frontend
│   └── api-server/        # Express API
├── packages/
│   ├── api-client-react/  # generated React Query hooks
│   ├── api-spec/          # OpenAPI spec + Orval codegen config
│   ├── api-zod/           # generated Zod schemas
│   └── db/                # Drizzle ORM schema + client
├── scripts/                # repo-maintenance scripts (e.g. post-merge hook)
└── docs/
    └── design-system.md    # UI/UX design spec
```

## Stack

- npm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
