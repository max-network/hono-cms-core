// Shared "site chrome" contract: the data a Hono CMS site's Layout / Header /
// Footer need, normalized so ONE set of components renders every site. Each
// consumer builds a `SiteChrome` from its own source (a static `siteConfig`
// object, or a per-request DB `SiteSettings` row) and passes it in — the
// components below import no site config of their own.
export {};
//# sourceMappingURL=chrome.js.map