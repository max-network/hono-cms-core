// Shared Vitest config for the Cloudflare Workers + D1 sites. Every CMS site's
// vitest.config.ts was the same ~19 lines (Workers pool + D1 migrations); this
// collapses each to `export default await defineWorkerVitestConfig()`.
import { defineConfig } from "vitest/config"
import { cloudflareTest, cloudflarePool, readD1Migrations } from "@cloudflare/vitest-pool-workers"

export interface WorkerVitestOptions {
  /** Path to the wrangler config the pool + test plugin read. Default `./wrangler.jsonc`. */
  configPath?: string
  /** Directory of D1 migrations provided to tests as `d1Migrations`. Default `migrations`. */
  migrationsDir?: string
}

/**
 * Build the Workers-pool Vitest config used across the CMS sites. Async because
 * D1 migrations are read at config time (matches the sites' existing top-level
 * `await`). Usage: `export default await defineWorkerVitestConfig()`.
 */
export async function defineWorkerVitestConfig(options: WorkerVitestOptions = {}) {
  const { configPath = "./wrangler.jsonc", migrationsDir = "migrations" } = options
  return defineConfig({
    plugins: [cloudflareTest({ wrangler: { configPath } })],
    test: {
      pool: cloudflarePool({ wrangler: { configPath } }),
      provide: {
        d1Migrations: await readD1Migrations(migrationsDir),
      },
    },
  })
}
