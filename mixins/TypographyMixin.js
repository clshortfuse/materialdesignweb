/**
 * @param {string} input
 * @return {string}
 */
function parseSize(input) {
  if (!input) return '0';
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
    .expressions({
      hasTextPaddingTop({ textPaddingTop, textPadding }) {
        return Boolean(textPaddingTop ?? textPadding);
      },
      hasTextPaddingBottom({ textPaddingBottom, textPadding }) {
        return Boolean(textPaddingBottom ?? textPadding);
      },
      slotStyle({ textPadding, textPaddingTop, textLeading }) {
        return `--text-padding-top:${parseSize(textPaddingTop ?? textPadding)};`
         + `--text-leading:${parseSize(textLeading)}`;
      },
      afterStyle({ textPadding, textPaddingBottom }) {
        return textPaddingBottom === '0' ? null
          : `--text-padding-bottom:${parseSize(textPaddingBottom ?? textPadding)};`;
      },
    })
    .html`
      <span id=after mdw-if={afterStyle} style={afterStyle}></span>
    `
    .recompose(({ refs: { slot } }) => {
      slot.setAttribute('style', '{slotStyle}');
      slot.setAttribute('text-padding-top', '{hasTextPaddingTop}');
      slot.setAttribute('text-leading', '{textLeading}');
    })
    .css`
      :host {
        display: block;
      }

      #slot[text-padding-top]::before {
        content: '';

        display: inline-block;
        vertical-align: baseline;

        block-size: 1.4ex; /* Estimate */
        margin-block-start: var(--text-padding-top);
      }
      @supports(height:1cap) {
        #slot[cap-top]::before {
          block-size: 1cap;
        }
      }

      #slot[text-leading]::before {
        content: '';

        display: inline-block;
        vertical-align: baseline;

        block-size: var(--text-leading);
      }
      
      #after {
        display: inline-block;
        vertical-align: calc(-1 * var(--text-padding-bottom));

        min-block-size: 1px; /* Safari workaround */
      }

    `;
}
