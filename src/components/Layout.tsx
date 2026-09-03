import type { FC, PropsWithChildren } from "hono/jsx"
import { raw } from "hono/html"
import { Header } from "./Header.js"
import { Footer } from "./Footer.js"
import type { SiteChrome } from "../lib/chrome.js"

interface LayoutProps {
  /** Normalized site chrome (built by the consumer from its own config). */
  chrome: SiteChrome
  title?: string
  description?: string
  path?: string
  ogImage?: string
  /** Page-specific JSON-LD, emitted after the Organization + WebSite nodes. */
  jsonLd?: Record<string, unknown>
  /** Gated or transient pages: emit `noindex` instead of the indexable directives. */
  noindex?: boolean
}

/**
 * Full HTML document + SEO head (title, canonical, Open Graph, Twitter,
 * Organization + WebSite JSON-LD) with the site's Header/main/Footer. Optional
 * fields in `chrome.seo` / `chrome.favicons` extend the head; their defaults
 * reproduce the shared baseline used across the sites.
 */
/**
 * A schema.org object as a JSON-LD script tag, with `<` escaped to `<` so a value cannot
 * close the element. These values are D1 rows editable from the admin UI — `site_full_name`
 * reaches the Organization node directly — so an unescaped `</script>` in one of them injected
 * whatever followed into every page of the site.
 *
 * Deliberately inlined rather than imported from `@max-network/seo`, which exports the identical
 * helper. This is one line of escaping, and taking a private cross-repo dependency for it would
 * make every consumer's CI need registry credentials to build shared chrome. If this package ever
 * adopts that one for the whole head plus sitemap and robots, the dependency earns itself then.
 */
const ldScript = (data: unknown): string =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  chrome,
  children,
  title,
  description,
  path = "/",
  ogImage,
  jsonLd,
  noindex = false,
}) => {
  const seo = chrome.seo ?? {}
  const pageTitle = title ? `${title} – ${chrome.name}` : `${chrome.name} – ${chrome.fullName}`
  const desc = description ?? chrome.description
  const canonicalUrl = `${chrome.domain}${path}`
  const image = ogImage ?? seo.ogImageDefault ?? "/images/og-default.jpg"
  const ogImageUrl = image.startsWith("http") ? image : `${chrome.domain}${image}`

  // One `@id` per node so the Organization and the WebSite are a connected graph rather than two
  // unrelated blobs: the WebSite names its publisher, and anything else on the page can point at
  // either by id. A caller-supplied organizationJsonLd keeps its own shape but still gets the id.
  const orgId = `${chrome.domain}/#organization`
  const suppliedOrg = seo.organizationJsonLd
  const organizationJsonLd = suppliedOrg
    ? { "@id": orgId, ...suppliedOrg }
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": orgId,
        name: chrome.fullName,
        alternateName: chrome.name,
        url: chrome.domain,
      }
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${chrome.domain}/#website`,
    name: chrome.fullName,
    alternateName: chrome.name,
    url: chrome.domain,
    inLanguage: seo.websiteInLanguage ?? chrome.lang,
    publisher: { "@id": orgId },
  }
  const favicons = chrome.favicons ?? []

  return (
    <html lang={chrome.lang}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{pageTitle}</title>
        <meta name="description" content={desc} />
        <meta name="author" content={seo.author ?? chrome.fullName} />
        <meta
          name="robots"
          content={
            noindex
              ? "noindex, nofollow"
              : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          }
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={ogImageUrl} />
        {seo.ogImageDimensions && (
          <>
            <meta property="og:image:width" content={String(seo.ogImageDimensions.width)} />
            <meta property="og:image:height" content={String(seo.ogImageDimensions.height)} />
          </>
        )}
        <meta property="og:site_name" content={chrome.fullName} />
        {seo.ogLocale && <meta property="og:locale" content={seo.ogLocale} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        {seo.twitterUrl && <meta name="twitter:url" content={canonicalUrl} />}
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={ogImageUrl} />

        {/* See {@link ldScript}: `<` must be escaped or a value closes the element. */}
        {raw(ldScript(organizationJsonLd))}
        {raw(ldScript(websiteJsonLd))}
        {jsonLd && raw(ldScript(jsonLd))}

        {favicons.map((f) => (
          <link key={f.href} rel={f.rel} href={f.href} sizes={f.sizes} type={f.type} />
        ))}
        <link rel="manifest" href={chrome.manifestHref ?? "/site.webmanifest"} />
        <link rel="stylesheet" href={chrome.stylesheetHref ?? "/styles/main.css"} />
      </head>
      <body>
        <Header chrome={chrome} />
        <main>{children}</main>
        <Footer chrome={chrome} />
      </body>
    </html>
  )
}
