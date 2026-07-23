import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";
/**
 * Full HTML document + SEO head (title, canonical, Open Graph, Twitter,
 * Organization + WebSite JSON-LD) with the site's Header/main/Footer. Optional
 * fields in `chrome.seo` / `chrome.favicons` extend the head; their defaults
 * reproduce the shared baseline used across the sites.
 */
export const Layout = ({ chrome, children, title, description, path = "/", ogImage, jsonLd, }) => {
    const seo = chrome.seo ?? {};
    const pageTitle = title ? `${title} – ${chrome.name}` : `${chrome.name} – ${chrome.fullName}`;
    const desc = description ?? chrome.description;
    const canonicalUrl = `${chrome.domain}${path}`;
    const image = ogImage ?? seo.ogImageDefault ?? "/images/og-default.jpg";
    const ogImageUrl = image.startsWith("http") ? image : `${chrome.domain}${image}`;
    const organizationJsonLd = seo.organizationJsonLd ?? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: chrome.fullName,
        alternateName: chrome.name,
        url: chrome.domain,
    };
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: chrome.fullName,
        alternateName: chrome.name,
        url: chrome.domain,
        inLanguage: seo.websiteInLanguage ?? chrome.lang,
    };
    const favicons = chrome.favicons ?? [];
    return (_jsxs("html", { lang: chrome.lang, children: [_jsxs("head", { children: [_jsx("meta", { charset: "UTF-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("title", { children: pageTitle }), _jsx("meta", { name: "description", content: desc }), _jsx("meta", { name: "author", content: seo.author ?? chrome.fullName }), _jsx("link", { rel: "canonical", href: canonicalUrl }), _jsx("meta", { property: "og:type", content: "website" }), _jsx("meta", { property: "og:url", content: canonicalUrl }), _jsx("meta", { property: "og:title", content: pageTitle }), _jsx("meta", { property: "og:description", content: desc }), _jsx("meta", { property: "og:image", content: ogImageUrl }), seo.ogImageDimensions && (_jsxs(_Fragment, { children: [_jsx("meta", { property: "og:image:width", content: String(seo.ogImageDimensions.width) }), _jsx("meta", { property: "og:image:height", content: String(seo.ogImageDimensions.height) })] })), _jsx("meta", { property: "og:site_name", content: chrome.fullName }), seo.ogLocale && _jsx("meta", { property: "og:locale", content: seo.ogLocale }), _jsx("meta", { name: "twitter:card", content: "summary_large_image" }), seo.twitterUrl && _jsx("meta", { name: "twitter:url", content: canonicalUrl }), _jsx("meta", { name: "twitter:title", content: pageTitle }), _jsx("meta", { name: "twitter:description", content: desc }), _jsx("meta", { name: "twitter:image", content: ogImageUrl }), _jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(organizationJsonLd) } }), _jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(websiteJsonLd) } }), jsonLd && (_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } })), favicons.map((f) => (_jsx("link", { rel: f.rel, href: f.href, sizes: f.sizes, type: f.type }, f.href))), _jsx("link", { rel: "manifest", href: chrome.manifestHref ?? "/site.webmanifest" }), _jsx("link", { rel: "stylesheet", href: chrome.stylesheetHref ?? "/styles/main.css" })] }), _jsxs("body", { children: [_jsx(Header, { chrome: chrome }), _jsx("main", { children: children }), _jsx(Footer, { chrome: chrome })] })] }));
};
//# sourceMappingURL=Layout.js.map