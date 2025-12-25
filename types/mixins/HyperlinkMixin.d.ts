/**
 * Adds hyperlink-related properties and URL helpers (href, target, rel, etc.).
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function HyperlinkMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    href: string;
    target: string;
    download: string;
    ping: string;
    rel: string;
    hreflang: string;
    referrerPolicy: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    origin: string;
    protocol: string;
    username: string;
    password: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
}, any[]> & import("../core/CustomElement.js").Class<object, any[]>;
//# sourceMappingURL=HyperlinkMixin.d.ts.map