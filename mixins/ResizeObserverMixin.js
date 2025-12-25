const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // @ts-ignore Skip cast
    entry.target.onResizeObserved(entry);
  }
});

/**
 * Attaches a shared ResizeObserver to the element and provides lifecycle helpers.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ResizeObserverMixin(Base) {
  return Base
    .observe({
      /** Enable or disable automatic ResizeObserver attachment (defaults true) */
      _resizeObserverEnabled: {
        type: 'boolean',
        value: true,
      },
    })
    .methods({
      /** @param {ResizeObserverEntry} entry */
      onResizeObserved(entry) {
        // Virtual function
      },
      observeResize() {
        resizeObserver.observe(this, {
          box: 'border-box',
        });
      },
      unobserveResize() {
        resizeObserver.unobserve(this);
      },
    })
    .on({
      connected() {
        if (!this._resizeObserverEnabled) return;
        this.observeResize();
      },
      disconnected() {
        this.unobserveResize();
      },
      _resizeObserverEnabledChanged(previous, enabled) {
        if (enabled) {
          this.observeResize();
        } else {
          this.unobserveResize();
        }
      },
    });
}
