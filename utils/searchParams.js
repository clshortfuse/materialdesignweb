/** @type {URLSearchParams} */
let currentSearchParams = null;

/** @return {URLSearchParams} */
export function getCurrentSearchParams() {
  if (!currentSearchParams) {
    let url;
    try {
      url = import.meta.url;
    } catch {}
    if (!url) {
      try {
        url = /** @type {HTMLScriptElement} */ (document.currentScript).src;
      } catch {}
    }
    currentSearchParams = new URL(url).searchParams;
  }
  return currentSearchParams;
}
