import type { FC, PropsWithChildren } from "hono/jsx"
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
}) => {
  const seo = chrome.seo ?? {}
  const pageTitle = title ? `${title} – ${chrome.name}` : `${chrome.name} – ${chrome.fullName}`
  const desc = description ?? chrome.description
  const canonicalUrl = `${chrome.domain}${path}`
  const image = ogImage ?? seo.ogImageDefault ?? "/images/og-default.jpg"
  const ogImageUrl = image.startsWith("http") ? image : `${chrome.domain}${image}`

  const organizationJsonLd = seo.organizationJsonLd ?? {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: chrome.fullName,
    alternateName: chrome.name,
    url: chrome.domain,
  }
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: chrome.fullName,
    alternateName: chrome.name,
    url: chrome.domain,
    inLanguage: seo.websiteInLanguage ?? chrome.lang,
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

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

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
