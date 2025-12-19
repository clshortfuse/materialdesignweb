import CustomElement from '../../core/CustomElement.js';

/** @typedef {{ highlightElement: (el: HTMLElement) => void }} HLJS */

/** @type {Promise<HLJS|null>|null} */
let _hljsModulePromise = null;

/**
 * Dynamically imports the highlight.js ES module and returns the HLJS instance.
 * Caches the promise in `_hljsModulePromise` so subsequent calls reuse it.
 * @return {Promise<HLJS|null>}
 */
async function loadHighlightJS() {
  if (_hljsModulePromise !== null) return await _hljsModulePromise;

  _hljsModulePromise = (async () => {
    try {
      /** @type {{default:HLJS}} */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, import/no-unresolved
      const hljsModule = await import('https://unpkg.com/@highlightjs/cdn-assets@11.11.1/es/highlight.min.js');
      return hljsModule.default;
    } catch (err) {
      console.error('Failed to load highlight.js module:', err);
      _hljsModulePromise = null;
      throw err;
    }
  })();

  return await _hljsModulePromise;
}

export default CustomElement
  .extend()
  .observe({
    label: 'string',
    _showCode: 'boolean',
    _showCodeActivated: 'boolean',
    code: 'string',
    x: { type: 'string', empty: 'center' },
    y: { type: 'string', empty: 'center' },
  })

  .expressions({
    formattedCode({ code, _showCodeActivated }) {
      // Don't bother normalizing/formatting the code until activated
      if (!code) return '';
      if (!_showCodeActivated) return '';

      // Normalize line endings and split
      const lines = String(code).replaceAll('\r\n', '\n').split('\n');

      // Strip leading/trailing blank lines
      while (lines.length && lines[0].trim() === '') lines.shift();
      while (lines.length && lines.at(-1).trim() === '') lines.pop();
      if (!lines.length) return '';

      // Replace tabs with 2 spaces for consistent measurement
      const replaced = lines.map((l) => l.replaceAll('\t', '  '));

      // Compute smallest common indent (in spaces) among non-blank lines
      let minIndent = Infinity;
      for (const l of replaced) {
        if (l.trim() === '') continue;
        const m = l.match(/^ */)[0].length;
        if (m < minIndent) minIndent = m;
      }
      if (!Number.isFinite(minIndent)) minIndent = 0;

      // Remove common indent and trim trailing whitespace on each line
      const out = replaced.map((l) => l.slice(minIndent).replace(/\s+$/, '')).join('\n');
      return out;
    },
  })
  .html`
    <mdw-card id=card role=region outlined x=stretch aria-labelledby=label>
      <mdw-box row x=between y=center padding=16 gap=8>
        <mdw-title id=label text-padding=0 aria-hidden=true>{label}</mdw-title>
        <mdw-icon-button mdw-if={code} id=code-toggle type=checkbox icon=code outlined checked={_showCode}>Show code</mdw-icon-button>
      </mdw-box>
      <mdw-divider></mdw-divider>
      <demo-preview id=preview gap=8 wrap x={x} y={y} padding=16 flex-1 hidden={_showCode}>
        <slot id=slot></slot>
      </demo-preview>
      <link mdw-if={_showCodeActivated} rel=stylesheet href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/github.min.css" media="(prefers-color-scheme: light)">
      <link mdw-if={_showCodeActivated} rel=stylesheet href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/github-dark.min.css" media="(prefers-color-scheme: dark)">
      <mdw-body id=code-block small mdw-if={code} hidden={!_showCode}>
        <pre id=code-pre><code id=code-inner class="language-html">{formattedCode}</code></pre>
      </mdw-body>
    </mdw-card>
  `
  .css`
    :host { display:flex; align-items:stretch; flex-direction:column; }
    #card { flex: 1; }

    #code-pre {
      margin: 0;
      white-space: pre;
      word-break: normal;
      overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace;
    }

    #code-pre[hidden], #code-block[hidden] { display: none; }

    #code-inner { display: block; }
  `

  .methods({
    /**
     * Highlight the code inside this component's code block.
     * Ensures highlight.js is loaded and calls `highlightElement` on the node.
     * @return {Promise<void>}
     */
    async highlightCode() {
      try {
        const codeEl = this.refs.codeInner;

        // Import the module (or reuse cached promise) and highlight.
        try {
          const hljs = await loadHighlightJS();
          hljs.highlightElement(codeEl);
        } catch (e) {
          console.error('Failed to highlight code:', e);
        }
      } catch (e) {
        console.error('Failed to highlight code:', e);
      }
    },
  })
  .childEvents({
    codeToggle: {
      change(event) {
        const input = /** @type {HTMLInputElement} */ (event.currentTarget);
        const checked = !!input.checked;
        this._showCode = checked;

        if (checked && !this._showCodeActivated) {
          this._showCodeActivated = true;

          (async () => {
            try {
              await loadHighlightJS();
              await this.highlightCode();
            } catch (e) {
              console.error('Failed to highlight code:', e);
            }
          })();
        }
      },
    },
  })
  .autoRegister('demo-preview-card');
