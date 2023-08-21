/**
 * @param {string} input
 * @return {string}
 */
function parseSize(input) {
  if (!input) return '';
  if (input.includes('px')) return input;
  if (input.includes('em')) return input;
  if (input.includes('ex')) return input;
  return `calc(${input.replace('sp', '')} * 0.0625rem)`;
}

/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TypographyMixin(Base) {
  return Base
    .observe({
      textTrim: 'boolean',
      textPadding: 'string',
      textPaddingTop: 'string',
      textLeading: 'string',
      textPaddingBottom: 'string',
    })
    .observe({
      _computedTextPaddingTop({ textPaddingTop, textPadding }) {
        return parseSize(textPaddingTop ?? textPadding);
      },
      _computedTextPaddingBottom({ textPaddingBottom, textPadding }) {
        return parseSize(textPaddingBottom ?? textPadding);
      },
      _computedTextLeading({ textLeading }) {
        return parseSize(textLeading);
      },
    })
    .observe({
      _beforeStyle({ _computedTextPaddingTop, _computedTextLeading, textTrim }) {
        if (textTrim) {
          return 'margin-top:1em';
        }
        if (_computedTextLeading) {
          return `vertical-align:${_computedTextLeading};max-block-size:0`;
        }
        if (_computedTextPaddingTop) {
          return `margin-top:${_computedTextPaddingTop}`;
        }
        return '';
      },
      _afterStyle({ textTrim, _computedTextPaddingBottom }) {
        if (textTrim) {
          return 'vertical-align:-1em';
        }
        if (_computedTextPaddingBottom) {
          return `vertical-align:calc(-1 * ${_computedTextPaddingBottom});`;
        }
        return '';
      },
      _hostStyle({ textTrim }) {
        if (textTrim) return ':host{margin-block:-1em}';
        return '';
      },
    })
    .html`
      <style mdw-if={!!_hostStyle}>{_hostStyle}</style>
      <span id=before mdw-if={!!_beforeStyle} style={_beforeStyle}></span>
      <span id=after mdw-if={!!_afterStyle} style={_afterStyle}></span>
    `
    .recompose(({ refs: { before, slot } }) => {
      // Chrome improperly renders slot::after display:inline-block
      // Use real element instead
      slot.before(before);
    })
    .css`
      :host {
        display: block;
      }

      span {
        display: inline-block;
      }

      #before {
        block-size: 1.4ex; /* Estimate */
      }
      @supports(height:1cap) {
        #before {
          block-size: 1cap;
        }
      }

      #after {
        min-block-size: 1px; /* Safari workaround */
      }

    `;
}
