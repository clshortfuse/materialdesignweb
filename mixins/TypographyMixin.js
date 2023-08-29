import DelegatesFocusMixin from './DelegatesFocusMixin.js';

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
    .mixin(DelegatesFocusMixin)
    .observe({
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
      _beforeStyle({ _computedTextPaddingTop, _computedTextLeading }) {
        if (_computedTextLeading) {
          return `margin-top:${_computedTextLeading}`;
        }
        if (_computedTextPaddingTop) {
          return `margin-top:${_computedTextPaddingTop}`;
        }
        return '';
      },
      _afterStyle({ _computedTextPaddingBottom }) {
        if (_computedTextPaddingBottom) {
          return `vertical-align:calc(-1em + (-1 * ${_computedTextPaddingBottom}));`;
        }
        return '';
      },
    })
    .html`
      <div id=wrapper style={_wrapperStyle} before={!!_beforeStyle} after={!!_afterStyle}
        ><span id=before mdw-if={!!_beforeStyle} style={_beforeStyle} text-leading={textLeading}></span
        ><span id=content before={!!_beforeStyle} after={!!_afterStyle}><span id=after mdw-if={!!_afterStyle} style={_afterStyle}></span></span
      ></div>
      `
    .recompose(({ refs: { content, slot } }) => {
      content.prepend(slot);
    })
    .css`
      :host {
        display: block;
      }

      :host(:where([text-padding],[text-padding-top],[text-padding-bottom])) {
        display: flex;
      }

      #wrapper {
        display: contents;

      }
      
      #wrapper:where([before], [after]) {
        display: flex;
        align-items: baseline; /* Allows growing element upwards without affecting text selection */

      }

      #wrapper[before] {
        margin-block-start: -1em;
      }

      #wrapper[after] {
        margin-block-end: -1em;
      }

      #before {
        display: inline-block;

        block-size: 1.4ex; /* Estimate */
        padding-block-start: 1em; /* Padding to be cropped by wrapper */
      }
      @supports(height:1cap) {
        #before {
          block-size: 1cap;
        }
      }

      #before[text-leading] {
        block-size: 0;
      }

      #content {
        display: contents;
      }
      
      #content:where([before], [after]) {
        display: block;
      }

      #after {
        display: inline-block;

        padding-block-end: 1em; /* Padding to be cropped by wrapper */
      }

    `;
}
