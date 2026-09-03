import { defineConfig } from "vitest/config"

// The package's OWN tests: plain Node, no Workers pool. The Layout is pure Hono JSX rendering
// with no bindings, and `src/testing/vitest.ts` is the Workers config shipped FOR CONSUMERS,
// which needs a wrangler.jsonc and D1 migrations this package does not have. JSX settings come
// from tsconfig.json (`jsxImportSource: "hono/jsx"`).
export default defineConfig({
  test: { include: ["test/**/*.test.tsx", "test/**/*.test.ts"] },
})
