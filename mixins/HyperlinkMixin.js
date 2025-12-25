import NavigationListenerMixin from './NavigationListenerMixin.js';

// https://html.spec.whatwg.org/multipage/links.html#dom-hyperlink-protocol-dev

/**
 * @template {keyof URL} T
 * @param {T} name
 * @return {ThisType<URL> & TypedPropertyDescriptor<URL[T]>}
 */
function buildHyperlinkDefinition(name) {
  return {
    get() {
      return new URL(this.href, window.location.href)[name];
    },
    set(value) {
      const { href } = this;
      if (!href) return;
      const url = new URL(href, window.location.href);
      url[name] = value;
      this.href = url.href;
    },
  };
}

/**
 * Adds hyperlink-related properties and URL helpers (href, target, rel, etc.).
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function HyperlinkMixin(Base) {
  return Base
    .mixin(NavigationListenerMixin)
    .observe({
      /** The URL that the hyperlink points to. */
      href: 'string',
      /** The browsing context in which to open the linked resource (e.g. '_blank'). */
      target: 'string',
      /** Suggested filename for download. */
      download: 'string',
      /** URLs to be pinged when the link is followed. */
      ping: 'string',
      /** Link relationship tokens (e.g. 'noopener', 'noreferrer'). */
      rel: 'string',
      /** Language of the linked resource. */
      hreflang: 'string',
      /** Referrer policy for the link (serialized to 'referrerpolicy' attribute). */
      referrerPolicy: { type: 'string', attr: 'referrerpolicy' },
    })
    .define({
      origin() { return new URL(this.href).origin; },
      protocol: buildHyperlinkDefinition('protocol'),
      username: buildHyperlinkDefinition('username'),
      password: buildHyperlinkDefinition('password'),
      host: buildHyperlinkDefinition('host'),
      hostname: buildHyperlinkDefinition('hostname'),
      port: buildHyperlinkDefinition('port'),
      pathname: buildHyperlinkDefinition('pathname'),
      search: buildHyperlinkDefinition('search'),
      hash: buildHyperlinkDefinition('hash'),
    })
    .html`
      <a id=anchor
      href={href}
      target={target}
      download={download}
      ping={ping}
      rel={rel}
      hreflang={hreflang}
      referrerpolicy={referrerPolicy}
      ></a>
    `
    .methods({
      toString() {
        return this.href;
      },
    });
}
