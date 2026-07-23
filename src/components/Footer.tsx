import type { FC } from "hono/jsx"
import type { SiteChrome } from "../lib/chrome.js"

/**
 * Site footer. Covers both site styles with one component: a link footer
 * (`footer.nav`) and/or an address footer (`footer.contact`). Class names match
 * every site's existing CSS (`site-footer`, `footer-content`, `footer-info`,
 * `footer-name`, `footer-links`, `footer-copy`).
 */
export const Footer: FC<{ chrome: SiteChrome }> = ({ chrome }) => {
  const year = new Date().getFullYear()
  const f = chrome.footer ?? {}
  const nameLine = f.name ?? chrome.fullName
  const copyright = f.copyright ?? chrome.name

  return (
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <p class="footer-name">{nameLine}</p>
            {f.contact?.street && (
              <p>
                {f.contact.street}, {f.contact.zip} {f.contact.city}
              </p>
            )}
            {f.contact?.phone && <p>{f.contact.phone}</p>}
          </div>
          {f.nav && f.nav.length > 0 && (
            <div class="footer-links">
              {f.nav.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div class="footer-copy">
            <p>
              © {year} {copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
