import type { FC, PropsWithChildren } from "hono/jsx"
import { raw } from "hono/html"
import { ldScript } from "@max-network/seo"
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

        {/*
          JSON-LD via @max-network/seo's ldScript, which escapes `<` to `\u003c`. These values
          come from D1 and are editable in the admin UI, so a site name containing `</script>`
          used to close the script element and inject whatever followed into every page.
        */}
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
