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

/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function HyperlinkMixin(Base) {
  return Base
    .mixin(NavigationListenerMixin)
    .observe({
      href: 'string',
      target: 'string',
      download: 'string',
      ping: 'string',
      rel: 'string',
      hreflang: 'string',
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
