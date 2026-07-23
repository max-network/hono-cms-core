/** A navigation / footer link. */
export interface NavItem {
    label: string;
    href: string;
}
/** Header logo. Render an `<img>` when `src` is set; render the text name when
 *  `showText` is true (default: true only when there is no image). */
export interface LogoConfig {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    showText?: boolean;
}
/** A `<link>` in <head> (favicons, touch icons). */
export interface FaviconLink {
    rel: string;
    href: string;
    sizes?: string;
    type?: string;
}
/** Footer content. Sites either list links (`nav`) or show an address
 *  (`contact`); both are optional so one component covers both styles. */
export interface FooterConfig {
    /** Bold name line. Default: `chrome.fullName`. */
    name?: string;
    nav?: NavItem[];
    contact?: {
        street?: string;
        zip?: string;
        city?: string;
        phone?: string;
    };
    /** Text after "© {year} ". Default: `chrome.name`. */
    copyright?: string;
}
/** Optional SEO knobs; defaults reproduce the common (twin-site) <head>. */
export interface ChromeSeo {
    /** Default OG/twitter image when a page passes none. Default `/images/og-default.jpg`. */
    ogImageDefault?: string;
    /** Emit `og:image:width`/`height` when set. */
    ogImageDimensions?: {
        width: number;
        height: number;
    };
    /** Emit `og:locale` when set (e.g. `de_AT`). */
    ogLocale?: string;
    /** Also emit `twitter:url` (= canonical) when true. */
    twitterUrl?: boolean;
    /** WebSite JSON-LD `inLanguage`. Default: `chrome.lang`. */
    websiteInLanguage?: string;
    /** Full Organization JSON-LD node. Default: a minimal `Organization`. */
    organizationJsonLd?: Record<string, unknown>;
    /** `<meta name="author">`. Default: `chrome.fullName`. */
    author?: string;
}
/** Everything the shared chrome needs to render one site. */
export interface SiteChrome {
    /** Short name (titles, copyright). */
    name: string;
    /** Full organization name. */
    fullName: string;
    /** `<html lang>`. */
    lang: string;
    /** Production origin (canonical/OG base), no trailing slash. */
    domain: string;
    /** Default meta description. */
    description: string;
    nav: NavItem[];
    logo?: LogoConfig;
    ariaLabels?: {
        menu?: string;
        nav?: string;
    };
    footer?: FooterConfig;
    seo?: ChromeSeo;
    favicons?: FaviconLink[];
    /** Web app manifest href. Default `/site.webmanifest`. */
    manifestHref?: string;
    /** Stylesheet href. Default `/styles/main.css`. */
    stylesheetHref?: string;
}
//# sourceMappingURL=chrome.d.ts.map