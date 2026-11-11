/** sitemap.xml and robots.txt built by `@max-network/seo` from the same {@link SiteChrome} the Layout renders. */
import { createSeo, sitemapDate, type Seo } from "@max-network/seo"
import type { SiteChrome } from "./chrome.js"

/** A page that exists per database row, with the date it was last edited. */
export interface DynamicPage {
  path: string
  /** A D1 timestamp or ISO string. Unparseable or missing means no `<lastmod>`, never today. */
  updatedAt?: string | null
}

function seoFor(chrome: SiteChrome): Seo<string> {
  return createSeo<string>({
    origin: chrome.domain,
    brand: chrome.fullName,
    description: chrome.description,
    ogImage: {
      path: chrome.seo?.ogImageDefault ?? "/images/og-default.jpg",
      type: "image/jpeg",
      width: chrome.seo?.ogImageDimensions?.width ?? 1200,
      height: chrome.seo?.ogImageDimensions?.height ?? 630,
      alt: chrome.fullName,
    },
    locales: [chrome.lang],
    defaultLocale: chrome.lang,
    ogLocales: { [chrome.lang]: chrome.seo?.ogLocale ?? `${chrome.lang}_${chrome.lang.toUpperCase()}` },
    pages: (chrome.pages ?? ["/"]).map((path) => ({ path, localized: false })),
  })
}

/** The `sitemap.xml` body; a `dynamic` page whose date will not parse is listed without `<lastmod>`. */
export function buildSitemap(chrome: SiteChrome, dynamic: readonly DynamicPage[] = []): string {
  const lastmod: Record<string, string | undefined> = {}
  for (const page of dynamic) lastmod[page.path] = sitemapDate(page.updatedAt)
  return seoFor(chrome).buildSitemap({
    lastmod,
    extraPages: dynamic.map((page) => ({ path: page.path, localized: false })),
  })
}

/** `sitemap.xml` as a cacheable `Response`. */
export function sitemapResponse(chrome: SiteChrome, dynamic: readonly DynamicPage[] = []): Response {
  return new Response(buildSitemap(chrome, dynamic), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

/** `robots.txt`: open to search and AI crawlers alike, `chrome.disallow` closed to both. */
export function robotsResponse(chrome: SiteChrome): Response {
  return seoFor(chrome).robotsResponse({ disallow: chrome.disallow ?? [] })
}
