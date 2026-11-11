# hono-cms-core

The shared **engine** of the Hono CMS template, extracted into a reusable package so multiple sites can depend on one source of truth instead of copy-pasting it.

It ships the parts that were measured to be near-identical across CMS sites (auth ~80%, schemas ~81%, `AdminLayout` ~94%, `HtmlEditor` ~83%, `logger` 100%):

- **`logger`** — leveled console logger with request-error helper (no dependencies).
- **`auth`** — session create/validate/delete and session-cookie helpers backed by Cloudflare D1, plus `legacyPasswordMatches` for hashes stored before 0.11. Password hashing itself is `hashPassword` / `verifyPassword` from `@max-network/worker-utils`.
- **`schemas`** — Zod 4 form-coercion + DB-row schemas and their inferred types.
- **`db`** — D1 query helpers (`getArticles`, `getProjects`, `getTeamMembers`, `getPage`, `getSiteSettings`).
- **`components/AdminLayout`** — the full admin shell (sidebar, theming, all admin CSS).
- **`components/ImageUpload`** — R2-backed image upload field (drag & drop).
- **`components/HtmlEditor`** — Pell-based rich-text editor field.

What stays **site-owned** (intentionally not packaged, 14–43% similarity): `config.ts`, `index.tsx`, `admin/routes.tsx`, public `pages/*`, and `Layout`/`Header`/`Footer`. None of the engine files import `config.ts`, so there is no per-site config to thread through the package.

## Install

Published to GitHub Packages:

```jsonc
{
  "dependencies": {
    "@max-network/hono-cms-core": "^0.11.0"
  }
}
```

`hono` (^4), `zod` (^4) and `@max-network/worker-utils` (`>=1.7.0 <2.0.0`) are **peer dependencies**: the consuming site provides them, so there is exactly one copy of each in the bundle.

## Usage

Import from the precise subpath entry points:

```ts
import { logger } from "@max-network/hono-cms-core/logger"
import { legacyPasswordMatches, validateSession, createSessionCookie } from "@max-network/hono-cms-core/auth"
import { contactFormSchema, type Article } from "@max-network/hono-cms-core/schemas"
import { getArticles, getSiteSettings } from "@max-network/hono-cms-core/db"
import { AdminLayout } from "@max-network/hono-cms-core/components/AdminLayout"
import { ImageUpload } from "@max-network/hono-cms-core/components/ImageUpload"
import { HtmlEditor } from "@max-network/hono-cms-core/components/HtmlEditor"
```

Login verifies with worker-utils and upgrades a pre-0.11 hash on the next successful sign-in:

```ts
import { hashPassword, verifyPassword } from "@max-network/worker-utils"

const check = await verifyPassword(password, user.password_hash, legacyPasswordMatches)
if (check.ok && check.needsRehash) await savePasswordHash(user.id, await hashPassword(password))
```

A root barrel (`@max-network/hono-cms-core`) re-exports everything for convenience, but prefer the subpaths so consumers only pull what they use.

### JSX configuration

The components are Hono JSX. The consuming `tsconfig.json` must set:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

## Build & distribution

`dist/` is built, never committed: `publish.yml` runs `typecheck test build` and publishes to GitHub Packages on every push to `main` whose `package.json` version is new.

```bash
npm ci
npm run check   # typecheck + tests
npm run build   # tsc -p tsconfig.build.json -> dist/
```

## Versioning

Bump `package.json` in the PR that changes engine code; merging to `main` publishes and tags it. 0.x minors may break consumers, so bump deliberately.
