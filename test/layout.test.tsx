/**
 * The shared public-site head.
 *
 * Three CMS sites render every page through this component, and its inputs come from D1 rows an
 * admin can edit. What is pinned here is what breaks silently: JSON-LD that a site name can close,
 * a graph whose nodes do not reference each other, and a canonical that drifts from the path.
 */
import { describe, it, expect } from "vitest"
import { Layout } from "../src/components/Layout"
import type { SiteChrome } from "../src/lib/chrome"
import { buildSitemap, robotsResponse } from "../src/lib/seo"

const chrome: SiteChrome = {
  name: "ivk",
  fullName: "Institut für Volkskultur",
  lang: "de",
  domain: "https://example.test",
  description: "A description.",
  nav: [],
  logo: { src: "/logo.png", alt: "logo" },
  ariaLabels: { menu: "Menü", nav: "Navigation" },
  footer: { name: "ivk", copyright: "ivk" },
}

const render = (props: Parameters<typeof Layout>[0] = { chrome }) =>
  (Layout(props) as { toString(): string }).toString()

describe("JSON-LD escaping", () => {
  it("cannot be closed by a value, however the site name is edited", () => {
    const evil: SiteChrome = { ...chrome, fullName: '</script><img src=x onerror=alert(1)>' }
    const html = render({ chrome: evil })
    expect(html).not.toContain("</script><img")
    expect(html).toContain("\u003c")
  })

  it("escapes a page's own JSON-LD too", () => {
    const html = render({ chrome, jsonLd: { "@type": "Article", name: "</script>x" } })
    expect(html).not.toContain("</script>x")
  })
})

describe("the graph", () => {
  const html = render()

  it("gives the organization and the website ids, and links them", () => {
    expect(html).toContain('"@id":"https://example.test/#organization"')
    expect(html).toContain('"@id":"https://example.test/#website"')
    expect(html).toContain('"publisher":{"@id":"https://example.test/#organization"}')
  })

  it("keeps a caller's own organization shape while still giving it the id", () => {
    const withOrg = render({
      chrome: {
        ...chrome,
        seo: { organizationJsonLd: { "@type": "ResearchOrganization", name: "ivk" } },
      },
    })
    expect(withOrg).toContain('"@type":"ResearchOrganization"')
    expect(withOrg).toContain('"@id":"https://example.test/#organization"')
  })
})

describe("robots and canonical", () => {
  it("declares the page indexable and canonicalizes it to its own path", () => {
    const html = render({ chrome, path: "/institut" })
    expect(html).toContain('content="index, follow, max-image-preview:large')
    expect(html).toContain('href="https://example.test/institut"')
  })

  it("noindexes a gated page", () => {
    expect(render({ chrome, noindex: true })).toContain('content="noindex, nofollow"')
  })
})

describe("sitemap and robots", () => {
  const withPages: SiteChrome = {
    ...chrome,
    pages: ["/", "/institut", "/kontakt"],
    disallow: ["/admin", "/api/"],
  }

  it("lists the chrome's pages and nothing else", () => {
    const xml = buildSitemap(withPages)
    for (const path of ["/", "/institut", "/kontakt"]) {
      expect(xml).toContain(`<loc>https://example.test${path}</loc>`)
    }
    expect(xml.match(/<url>/g)).toHaveLength(3)
  })

  it("invents no lastmod, changefreq or priority", () => {
    const xml = buildSitemap(withPages)
    for (const tag of ["lastmod", "changefreq", "priority"]) expect(xml).not.toContain(tag)
  })

  it("dates a database-backed page by its own edit, and drops one it cannot parse", () => {
    const xml = buildSitemap(withPages, [
      { path: "/projekte/alpen", updatedAt: "2026-06-14 08:30:00" },
      { path: "/projekte/chor", updatedAt: "" },
    ])
    expect(xml).toContain("<loc>https://example.test/projekte/alpen</loc>\n    <lastmod>2026-06-14</lastmod>")
    expect(xml).toContain("<loc>https://example.test/projekte/chor</loc>")
    expect(xml.match(/<lastmod>/g)).toHaveLength(1)
  })

  it("gives the named AI crawlers the same disallow list as the wildcard group", async () => {
    const txt = await robotsResponse(withPages).text()
    // robots.txt has no inheritance: a named group with no disallow is an open invitation.
    expect(txt.match(/Disallow: \/admin/g)).toHaveLength(2)
    expect(txt).toContain("User-agent: ClaudeBot")
    expect(txt).toContain("Sitemap: https://example.test/sitemap.xml")
  })
})
