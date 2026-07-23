import type { FC, PropsWithChildren } from "hono/jsx";
import type { SiteChrome } from "../lib/chrome.js";
interface LayoutProps {
    /** Normalized site chrome (built by the consumer from its own config). */
    chrome: SiteChrome;
    title?: string;
    description?: string;
    path?: string;
    ogImage?: string;
    /** Page-specific JSON-LD, emitted after the Organization + WebSite nodes. */
    jsonLd?: Record<string, unknown>;
}
/**
 * Full HTML document + SEO head (title, canonical, Open Graph, Twitter,
 * Organization + WebSite JSON-LD) with the site's Header/main/Footer. Optional
 * fields in `chrome.seo` / `chrome.favicons` extend the head; their defaults
 * reproduce the shared baseline used across the sites.
 */
export declare const Layout: FC<PropsWithChildren<LayoutProps>>;
export {};
//# sourceMappingURL=Layout.d.ts.map