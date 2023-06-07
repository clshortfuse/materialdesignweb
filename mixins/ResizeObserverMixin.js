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
    .set({
      observeResizeOnConnected: true,
    })
    .methods({
      /** @param {ResizeObserverEntry} entry */
      onResizeObserved(entry) {
        // Virtual function
      },
      observeResize() {
        resizeObserver.observe(this);
      },
      unobserveResize() {
        resizeObserver.unobserve(this);
      },
    })
    .on({
      connected() {
        if (!this.observeResizeOnConnected) return;
        this.observeResize();
      },
      disconnected() {
        this.unobserveResize();
      },
    });
}
