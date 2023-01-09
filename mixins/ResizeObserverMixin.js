const resizeObserver = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    // @ts-ignore Skip cast
    target.onResizeObserved();
  }
});

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ResizeObserverMixin(Base) {
  return Base
    .extend()
    .methods({
      onResizeObserved() {
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
