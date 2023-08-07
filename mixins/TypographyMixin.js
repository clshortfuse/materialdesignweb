import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';

/**
 * @param {string} input
 * @return {string}
 */
function parseSize(input) {
  if (!input) return '';
  if (input.includes('px')) return input;
  if (input.includes('em')) return input;
  return `calc(${input.replace('sp', '')} * 0.0625rem)`;
}

/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TypographyMixin(Base) {
  return Base
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
      _beforeStyle: {
        ...ELEMENT_STYLER_TYPE,
        get({ _computedTextPaddingTop: marginBlockStart, _computedTextLeading: blockSize }) {
          if (!marginBlockStart && !blockSize) return null;
          return {
            target: 'before',
            styles: {
              ...(marginBlockStart ? { marginBlockStart } : {}),
              ...(blockSize ? { blockSize } : {}),
            },
          };
        },
      },
      _afterStyle: {
        ...ELEMENT_STYLER_TYPE,
        get({ _computedTextPaddingBottom }) {
          if (!_computedTextPaddingBottom) return null;
          return {
            target: 'after',
            styles: {
              verticalAlign: `calc(-1 * ${_computedTextPaddingBottom})`,
            },
          };
        },
      },
    })
    .html`
      <span id=before mdw-if={!!_beforeStyle}></span>
      <span id=after mdw-if={!!_afterStyle}></span>
    `
    .recompose(({ refs: { before, slot } }) => {
      slot.before(before);
    })
    .css`
      :host {
        display: block;
      }

      span {
        display: inline-block;
        vertical-align: 0;
      }

      #slot {
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
