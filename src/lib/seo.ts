/**
 * sitemap.xml and robots.txt for a CMS site, built from the same {@link SiteChrome} the shared
 * Layout renders its head from — so the pages a crawler is told about and the pages that exist
 * cannot drift apart.
 *
 * The rules come from `@max-network/seo`, the org's SEO package, rather than a second
 * implementation living here. Every site using this package shipped a hand-maintained
 * `public/sitemap.xml` instead, and every one of them had gone stale: ivkultur's said every page
 * was last modified on 2026-02-28, months after the pages changed, and all of them carried the
 * `changefreq` and `priority` Google has ignored since 2023.
 *
 * These sites are single-language, so every page is `localized: false`: each canonicalizes to its
 * own clean URL and none claims an hreflang alternate it does not have.
 */
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

/**
 * The `sitemap.xml` body. `dynamic` carries pages the chrome cannot list because they come from
 * the database; each keeps its own edit date, and one that will not parse is simply omitted. No
 * entry is ever stamped with "today": a sitemap claiming the whole site changed on every deploy
 * is one Google stops believing.
 */
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

/**
 * `robots.txt` as a `Response`: the public surface open to search engines and AI answer engines
 * alike, `chrome.disallow` closed to both, and a Sitemap line pointing at the canonical origin.
 *
 * The AI crawlers are named as their own group rather than left to the wildcard, because
 * robots.txt has no inheritance: a named `User-agent` group REPLACES the `*` group rather than
 * extending it, so a named crawler with no disallow rules is one you have invited everywhere.
 */
export function robotsResponse(chrome: SiteChrome): Response {
  return seoFor(chrome).robotsResponse({ disallow: chrome.disallow ?? [] })
}
