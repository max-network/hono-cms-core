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
