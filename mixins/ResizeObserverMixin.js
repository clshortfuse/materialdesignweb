const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // @ts-ignore Skip cast
    entry.target.onResizeObserved(entry);
  }
});

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ResizeObserverMixin(Base) {
  return Base
    .extend()
    .methods({
      /** @param {ResizeObserverEntry} entry */
      onResizeObserved(entry) {
        // Virtual function
      },
    })
    .on({
      connected() {
        resizeObserver.observe(this);
      },
      disconnected() {
        resizeObserver.unobserve(this);
      },
    });
}
