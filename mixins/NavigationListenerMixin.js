/**
 * Listens for HTMLAnchorElement click events that will trigger navigation
 * and throws a cancelable `mdw:hyperlink` event before firing.
 * Will be supported until Navigation API is widely available
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function NavigationListenerMixin(Base) {
  return Base
    .rootEvents({
      click(event) {
        const { target } = event;
        if (!(target instanceof HTMLAnchorElement)) return;
        if (!target.href) return;
        const actionAllowed = target.dispatchEvent(new CustomEvent('mdw:hyperlink', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            download: target.download,
            href: target.href,
            hreflang: target.hreflang,
            target: target.target,
          },
        }));
        if (!actionAllowed) {
          // Allow the click event to propagate
          // event.stopPropagation();
          // Don't perform native hyperlink action
          event.preventDefault();
        }
      },
    });
}
