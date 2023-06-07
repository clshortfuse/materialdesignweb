const registeredElements = new Set();

/** @type {MutationObserver} */
let rtlObserver;

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function RTLObserverMixin(Base) {
  return Base
    .observe({
      pageIsRTL: {
        type: 'boolean',
        value: document.documentElement.dir === 'rtl',
      },
    })
    .on({
      connected() {
        if (!rtlObserver) {
          rtlObserver = new MutationObserver(() => {
            const isRTL = document.documentElement.dir === 'rtl';
            for (const el of registeredElements) {
              el.pageIsRTL = isRTL;
            }
          });
          rtlObserver.observe(document.documentElement, { attributeFilter: ['dir'] });
        }
        registeredElements.add(this);
      },
      disconnected() {
        registeredElements.delete(this);
      },
    });
}
