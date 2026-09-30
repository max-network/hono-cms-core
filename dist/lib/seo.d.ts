import type { SiteChrome } from "./chrome.js";
/** A page that exists per database row, with the date it was last edited. */
export interface DynamicPage {
    path: string;
    /** A D1 timestamp or ISO string. Unparseable or missing means no `<lastmod>`, never today. */
    updatedAt?: string | null;
}
/**
 * The `sitemap.xml` body. `dynamic` carries pages the chrome cannot list because they come from
 * the database; each keeps its own edit date, and one that will not parse is simply omitted. No
 * entry is ever stamped with "today": a sitemap claiming the whole site changed on every deploy
 * is one Google stops believing.
 */
export declare function buildSitemap(chrome: SiteChrome, dynamic?: readonly DynamicPage[]): string;
/** `sitemap.xml` as a cacheable `Response`. */
export declare function sitemapResponse(chrome: SiteChrome, dynamic?: readonly DynamicPage[]): Response;
/**
 * `robots.txt` as a `Response`: the public surface open to search engines and AI answer engines
 * alike, `chrome.disallow` closed to both, and a Sitemap line pointing at the canonical origin.
 *
 * The AI crawlers are named as their own group rather than left to the wildcard, because
 * robots.txt has no inheritance: a named `User-agent` group REPLACES the `*` group rather than
 * extending it, so a named crawler with no disallow rules is one you have invited everywhere.
 */
export declare function robotsResponse(chrome: SiteChrome): Response;
//# sourceMappingURL=seo.d.ts.map