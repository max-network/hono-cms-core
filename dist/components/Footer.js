import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
/**
 * Site footer. Covers both site styles with one component: a link footer
 * (`footer.nav`) and/or an address footer (`footer.contact`). Class names match
 * every site's existing CSS (`site-footer`, `footer-content`, `footer-info`,
 * `footer-name`, `footer-links`, `footer-copy`).
 */
export const Footer = ({ chrome }) => {
    const year = new Date().getFullYear();
    const f = chrome.footer ?? {};
    const nameLine = f.name ?? chrome.fullName;
    const copyright = f.copyright ?? chrome.name;
    return (_jsx("footer", { class: "site-footer", children: _jsx("div", { class: "container", children: _jsxs("div", { class: "footer-content", children: [_jsxs("div", { class: "footer-info", children: [_jsx("p", { class: "footer-name", children: nameLine }), f.contact?.street && (_jsxs("p", { children: [f.contact.street, ", ", f.contact.zip, " ", f.contact.city] })), f.contact?.phone && _jsx("p", { children: f.contact.phone })] }), f.nav && f.nav.length > 0 && (_jsx("div", { class: "footer-links", children: f.nav.map((item) => (_jsx("a", { href: item.href, children: item.label }, item.href))) })), _jsx("div", { class: "footer-copy", children: _jsxs("p", { children: ["\u00A9 ", year, " ", copyright] }) })] }) }) }));
};
//# sourceMappingURL=Footer.js.map