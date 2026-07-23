import type { FC } from "hono/jsx"
import type { SiteChrome } from "../lib/chrome.js"

/**
 * Site header: logo (text, image, or both) + a CSS-only mobile toggle + nav.
 * Emits the same class names every site's `main.css` already styles
 * (`site-header`, `container`, `logo`, `logo-img`, `logo-text`, `nav-toggle`,
 * `main-nav`), so moving a site onto this component is a zero-CSS-change swap.
 */
export const Header: FC<{ chrome: SiteChrome }> = ({ chrome }) => {
  const { logo, nav, name, ariaLabels } = chrome
  const showText = logo?.showText ?? !logo?.src

  return (
    <header class="site-header">
      <div class="container">
        <a href="/" class="logo">
          {logo?.src && (
            <img
              src={logo.src}
              alt={logo.alt ?? ""}
              width={logo.width}
              height={logo.height}
              class="logo-img"
            />
          )}
          {showText && <span class="logo-text">{name}</span>}
        </a>

        {/* Mobile menu toggle (CSS-only) */}
        <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-hidden="true" />
        <label for="nav-toggle" class="nav-toggle-label" aria-label={ariaLabels?.menu ?? "Open menu"}>
          <span></span>
        </label>

        <nav class="main-nav" aria-label={ariaLabels?.nav ?? "Main navigation"}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
