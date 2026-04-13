# AGENTS.md

## Monorepo Structure

Bun + Turborepo monorepo. Package manager: **bun** (not npm/yarn/pnpm).

```
apps/
  web/       # TanStack Start (SSR) + Vite + TailwindCSS v4
  native/    # Expo Router (React Native) + react-native-unistyles v2
  server/    # Hono on Cloudflare Workers + ORPC + Better Auth
packages/
  api/       # ORPC procedures (publicProcedure, protectedProcedure)
  auth/      # Better Auth config (server + Expo plugin)
  db/        # Drizzle ORM schema + Turso client
  env/       # @t3-oss/env-core — server/web/native env validation
  ui/        # Shared shadcn/ui components + TailwindCSS
  config/    # Shared tsconfig.base.json
  infra/     # Alchemy (Cloudflare IaC) deployment config
```

## Commands

```bash
bun install                  # install deps (always bun, never npm)
bun run dev                  # start all apps (turbo dev)
bun run dev:web              # web only (port 3001)
bun run dev:server           # server only (port 3000)
bun run dev:native           # Expo dev server
bun run test                 # run all tests (turbo test)
bun run test:run             # run all tests, no watch
bun run check-types          # TypeScript check all packages
bun run db:push              # push Drizzle schema to Turso
bun run db:local             # start local SQLite via turso dev
bun run deploy               # deploy to Cloudflare via Alchemy
bun run destroy              # tear down Cloudflare infra
```

### Single-package test

```bash
bun run test:run --filter @airbnb-clone/api
bun run test:run --filter @airbnb-clone/db
bun run test:run --filter @airbnb-clone/auth
bun run test:run --filter web
```

Or from within a package: `bun vitest run`

## Architecture & Key Conventions

- **API**: ORPC procedures use `os.$context<Context>()` from `@orpc/server`. Test procedures via `call()` from `@orpc/server`. Routers in `packages/api/src/routers/`.
- **Auth**: Better Auth with Drizzle adapter. Server handler at `/api/auth/*`. Expo plugin for native.
- **DB**: Turso (edge SQLite) via `@libsql/client`. Drizzle ORM. Schema in `packages/db/src/schema/`. Connection reads `DATABASE_URL` + `DATABASE_AUTH_TOKEN` from env.
- **Env**: Three entrypoints — `@airbnb-clone/env/server` (Cloudflare Workers `cloudflare:workers` module), `@airbnb-clone/env/web`, `@airbnb-clone/env/native`. Server env uses Alchemy bindings, not `.env` files in production.
- **UI**: shadcn/ui primitives in `packages/ui`. Import as `@airbnb-clone/ui/components/button`. Add new primitives via `npx shadcn@latest add <name> -c packages/ui`.
- **Deployment**: Alchemy (`alchemy.run.ts`) deploys both web (TanStackStart) and server (Worker) to Cloudflare.

## Testing

- **Runner**: Vitest (v3) across all testable packages.
- **Test file convention**: `src/**/*.test.ts` (packages), `src/**/*.{test,spec}.{ts,tsx}` (web).
- **Setup files**: `packages/api/src/test/setup.ts` (mock DB), `apps/web/src/test/setup.ts` (jsdom, mock orpc/auth-client/react-router).
- **Globals**: `true` in all vitest configs — `describe/it/expect` available without imports.
- **Mock pattern**: API tests mock `@airbnb-clone/db` with `mockDb` chainable fns. Web tests mock orpc client, auth-client, and TanStack Router.
- **Web**: Also has `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.

## Native App Gotchas

- **react-native-unistyles is v2** (not v3). V2 has no babel plugin — do NOT add `react-native-unistyles/plugin` to `babel.config.js`.
- **Expo SDK 54+** (check `app.json` for actual version). Uses Hermes (`hermesV1Enabled: true`).
- Native deps are semver-locked to Expo compatible versions — use `~` ranges from Expo, not arbitrary `^`.
- After changing native deps: `cd apps/native/android && ./gradlew clean` then rebuild.
- DevTools shows "No compatible apps connected" until Metro bundler connects to a device — this is expected.

## Environment

Never read `.env` files. Use `.env.example` for reference.

Required env vars (see `apps/server/.env.example`):
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`
- `DATABASE_URL`, `DATABASE_AUTH_TOKEN` (Turso credentials)
- `EXPO_PUBLIC_SERVER_URL` (native)

## TypeScript

- Base config: `@airbnb-clone/config/tsconfig.base.json` — `strict: true`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`.
- All packages extend this base.
- Workspace imports use `@airbnb-clone/*` package names, not relative paths across packages.

## Key Imports

```ts
import { db } from "@airbnb-clone/db";          // Drizzle client
import { auth } from "@airbnb-clone/auth";       // Better Auth instance
import { appRouter } from "@airbnb-clone/api/routers/index"; // ORPC router
import { publicProcedure, protectedProcedure } from "@airbnb-clone/api"; // ORPC procedures
import { env } from "@airbnb-clone/env/server";  // Env vars (Cloudflare)
import { Button } from "@airbnb-clone/ui/components/button"; // Shared UI
```