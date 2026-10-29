# hono-cms-core

The shared **engine** of the Hono CMS template, extracted into a reusable package so multiple sites can depend on one source of truth instead of copy-pasting it.

It ships the parts that were measured to be near-identical across CMS sites (auth ~80%, schemas ~81%, `AdminLayout` ~94%, `HtmlEditor` ~83%, `logger` 100%):

- **`logger`** — leveled console logger with request-error helper (no dependencies).
- **`auth`** — SHA-256 password hashing, session create/validate/delete, and session-cookie helpers backed by Cloudflare D1.
- **`schemas`** — Zod 4 form-coercion + DB-row schemas and their inferred types.
- **`db`** — D1 query helpers (`getArticles`, `getProjects`, `getTeamMembers`, `getPage`, `getSiteSettings`).
- **`components/AdminLayout`** — the full admin shell (sidebar, theming, all admin CSS).
- **`components/ImageUpload`** — R2-backed image upload field (drag & drop).
- **`components/HtmlEditor`** — Pell-based rich-text editor field.

What stays **site-owned** (intentionally not packaged, 14–43% similarity): `config.ts`, `index.tsx`, `admin/routes.tsx`, public `pages/*`, and `Layout`/`Header`/`Footer`. None of the engine files import `config.ts`, so there is no per-site config to thread through the package.

## Install

This is consumed as a **git dependency**. Pin a tag so the ref is stable:

```jsonc
{
  "dependencies": {
    "hono-cms-core": "github:quotentiroler/hono-cms-core#v0.1.0"
  }
}
```

`hono` (^4), `zod` (^4) and `@max-network/worker-utils` (`>=0.19.0 <2.0.0`) are **peer dependencies**: the consuming site provides them, so there is exactly one copy of each in the bundle.

## Usage

Import from the precise subpath entry points:

```ts
import { logger } from "hono-cms-core/logger"
import { hashPassword, validateSession, createSessionCookie } from "hono-cms-core/auth"
import { contactFormSchema, type Article } from "hono-cms-core/schemas"
import { getArticles, getSiteSettings } from "hono-cms-core/db"
import { AdminLayout } from "hono-cms-core/components/AdminLayout"
import { ImageUpload } from "hono-cms-core/components/ImageUpload"
import { HtmlEditor } from "hono-cms-core/components/HtmlEditor"
```

A root barrel (`hono-cms-core`) re-exports everything for convenience, but prefer the subpaths so consumers only pull what they use.

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

`dist/` (compiled JS + `.d.ts`) is **committed to the repository**, and that is the primary distribution mechanism.

Why committed `dist/` rather than a `prepare`-on-install build:

- A `github:` install only runs the `prepare` lifecycle script when dev dependencies install and the environment is not `--omit=dev`/production. In CI and many bundler toolchains that is unreliable, so resolution of `hono-cms-core/auth` etc. could fail.
- Committing `dist/` makes the package resolve deterministically the moment the git ref is checked out — no build step, no dev deps required at the consumer.

A `prepare` script (`npm run build`) is still defined so that a fresh clone / `npm install` inside this repo rebuilds `dist/`. The workflow when changing engine code is: edit `src/`, run `npm run build`, commit `src/` **and** the regenerated `dist/`, then tag a new release.

```bash
npm install   # installs dev deps + runs prepare (build)
npm run build # tsc -p tsconfig.build.json -> dist/
```

## Versioning

Tag every release (e.g. `v0.1.0`) so consumers can pin a ref. Engine changes are breaking by default for sites that depend on exact behavior, so bump deliberately.
