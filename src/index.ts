// Root barrel for hono-cms-core.
// Prefer the precise subpath entry points (e.g. "hono-cms-core/auth") in
// consumers; this barrel is provided for convenience.

export { logger } from "./lib/logger.js"

export {
  generateSessionId,
  hashPassword,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
  cleanupExpiredSessions,
  getSessionIdFromCookie,
  createSessionCookie,
  deleteSessionCookie,
} from "./lib/auth.js"

export * from "./lib/schemas.js"

export {
  getArticles,
  getProjects,
  getTeamMembers,
  getGalleries,
  getGallery,
  getPage,
  getSiteSettings,
} from "./lib/db.js"
export type { PageContent } from "./lib/db.js"

// AdminLayout now lives in @max-network/hono-ui/admin — consumers import it from there directly.
export { ImageUpload } from "./components/ImageUpload.js"
export { HtmlEditor } from "./components/HtmlEditor.js"

// Shared public-site chrome — one Layout/Header/Footer for every CMS site,
// driven by a normalized SiteChrome the consumer builds from its own config.
export { Layout } from "./components/Layout.js"

// sitemap.xml + robots.txt from the same SiteChrome the Layout renders its head from, so the
// pages a crawler is told about and the pages that exist cannot drift apart.
export { buildSitemap, sitemapResponse, robotsResponse } from "./lib/seo.js"
export type { DynamicPage } from "./lib/seo.js"
export { Header } from "./components/Header.js"
export { Footer } from "./components/Footer.js"
export type {
  SiteChrome,
  NavItem,
  LogoConfig,
  FaviconLink,
  FooterConfig,
  ChromeSeo,
} from "./lib/chrome.js"
