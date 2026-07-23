import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
/**
 * Site header: logo (text, image, or both) + a CSS-only mobile toggle + nav.
 * Emits the same class names every site's `main.css` already styles
 * (`site-header`, `container`, `logo`, `logo-img`, `logo-text`, `nav-toggle`,
 * `main-nav`), so moving a site onto this component is a zero-CSS-change swap.
 */
export const Header = ({ chrome }) => {
    const { logo, nav, name, ariaLabels } = chrome;
    const showText = logo?.showText ?? !logo?.src;
    return (_jsx("header", { class: "site-header", children: _jsxs("div", { class: "container", children: [_jsxs("a", { href: "/", class: "logo", children: [logo?.src && (_jsx("img", { src: logo.src, alt: logo.alt ?? "", width: logo.width, height: logo.height, class: "logo-img" })), showText && _jsx("span", { class: "logo-text", children: name })] }), _jsx("input", { type: "checkbox", id: "nav-toggle", class: "nav-toggle", "aria-hidden": "true" }), _jsx("label", { for: "nav-toggle", class: "nav-toggle-label", "aria-label": ariaLabels?.menu ?? "Open menu", children: _jsx("span", {}) }), _jsx("nav", { class: "main-nav", "aria-label": ariaLabels?.nav ?? "Main navigation", children: _jsx("ul", { children: nav.map((item) => (_jsx("li", { children: _jsx("a", { href: item.href, children: item.label }) }, item.href))) }) })] }) }));
};
//# sourceMappingURL=Header.js.map