import { basename, relative } from 'node:path';

import * as walk from 'acorn-walk';
import CleanCSS from 'clean-css';
import { minify as minifyHTML } from 'html-minifier-terser';
import MagicString from 'magic-string';

/**
 * @typedef TransformTask
 * @prop {string} type
 * @prop {string} raw
 * @prop {number} start
 * @prop {number} end
 * @prop {string} [data]
 */

/**
 * @return {import('rollup').Plugin}
 */
export function minifyTemplateLiterals() {
  return {
    name: 'minify-template-literals',
    async transform(code, id) {
      const path = id;
      const file = basename(path);
      /** @type {import('rollup').RollupWarning[]} */
      const warnings = [];
      /** @type {TransformTask[]} */
      const transforms = [];
      const magicString = new MagicString(code);
      walk.simple(this.parse(code, { ecmaVersion: 'latest', sourceType: 'module', locations: true }), {
        TaggedTemplateExpression(node) {
          const { quasi } = node;
          if (quasi.expressions.length) {
            let realStartNode = node.tag;
            if (node.tag.type === 'MemberExpression') {
              realStartNode = node.tag.property;
            }
            const realStartLocation = realStartNode.loc.start;
            const length = quasi.end - realStartNode.start;

            if (length < 50) return;
            warnings.push({
              message: `Large, complex template expression over 50 characters (${length}) cannot be minified. Use expressions or observables`,
              loc: {
                column: realStartLocation.column,
                line: realStartLocation.line,
                file: relative(process.cwd(), path),
              },
              code: code.slice(realStartNode.start - realStartLocation.column, realStartNode.end),
            });
            return;
          }
          if (node.quasi.quasis?.length !== 1) {
            warnings.push({
              message: 'Cannot minify joined template expression',
              loc: {
                column: node.loc?.start.column,
                line: node.loc?.start.line,
                file: relative(process.cwd(), path),
              },
            });
            // warnings.push(relative(process.cwd(), path), 'Cannot minify joined:', contents.slice(node.start, node.end));
            return;
          }

          const { tag } = node;
          let type;
          switch (tag.type) {
            case 'Identifier':
              type = tag.name;
              break;
            case 'MemberExpression':
              type = tag.property.name;
              break;
            default:
              console.warn('Unknown TaggedTemplateExpression', tag);
              return;
          }

          if (type !== 'html' && type !== 'css') {
            console.warn('Unknown template literal type:', type);
            return;
          }
          const [templateElement] = node.quasi.quasis;
          const { raw } = templateElement.value;
          const { start, end } = templateElement;
          transforms.push({ type, raw, start, end });
        },
      });

      const transformed = await Promise.all(
        transforms.map(async ({ type, raw, start, end }) => {
          let data;
          if (type === 'html') {
            data = await minifyHTML(raw, {
              caseSensitive: false,
              collapseWhitespace: true,
              collapseBooleanAttributes: false,
              removeAttributeQuotes: true,
              removeComments: true,
            });
          } else {
            data = new CleanCSS({}).minify(raw).styles;
          }
          return { data, type, raw, start, end };
        }),
      );
      for (const { data, start, end } of transformed.reverse()) {
        magicString.update(start, end, data);
      }

      for (const warning of warnings) {
        this.warn(warning);
      }
      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          source: file,
          includeContent: true,
          hires: true,
        }),
      };
    },
  };
}
