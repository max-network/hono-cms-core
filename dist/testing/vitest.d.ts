export interface WorkerVitestOptions {
    /** Path to the wrangler config the pool + test plugin read. Default `./wrangler.jsonc`. */
    configPath?: string;
    /** Directory of D1 migrations provided to tests as `d1Migrations`. Default `migrations`. */
    migrationsDir?: string;
}
/**
 * Build the Workers-pool Vitest config used across the CMS sites. Async because
 * D1 migrations are read at config time (matches the sites' existing top-level
 * `await`). Usage: `export default await defineWorkerVitestConfig()`.
 */
export declare function defineWorkerVitestConfig(options?: WorkerVitestOptions): Promise<import("vite").UserConfig>;
//# sourceMappingURL=vitest.d.ts.map