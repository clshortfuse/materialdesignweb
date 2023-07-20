import { readFile } from 'node:fs/promises';
import { basename, relative } from 'node:path';

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import esbuild from 'esbuild';
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
 * @param {Object} [options]
 * @param {(css:string) => string|Promise<string>} [options.cssPreprocessor]
 * @param {(html:string) => string|Promise<string>} [options.htmlPreprocessor]
 * @return {import('esbuild').Plugin}
 */
export function minifyTemplateLiterals({ cssPreprocessor, htmlPreprocessor } = {}) {
  return {
    name: 'minify template literals',
    setup(build) {
    /** @type {Map<string, {input:string, output: esbuild.OnLoadResult}>} */
      const cache = new Map();
      build.onLoad({ filter: /\.js$/ }, async (args) => {
        const input = await readFile(args.path, 'utf8');
        const key = args.path;
        let entry = cache.get(key);

        if (!entry || entry.input !== input) {
          entry = {
            input,
            output: {
              contents: input,
              warnings: [],
            },
          };
          const { warnings } = entry.output;
          if (build.initialOptions.minify || build.initialOptions.minifyWhitespace
          || build.initialOptions.minifyIdentifiers
          || build.initialOptions.minifySyntax) {
            const file = basename(args.path);

            /** @type {TransformTask[]} */
            const transforms = [];
            const magicString = new MagicString(input);
            walk.simple(acorn.parse(input, { ecmaVersion: 'latest', sourceType: 'module', locations: true }), {
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
                    text: `Large, complex template expression over 50 characters (${length}) cannot be minified.`,
                    location: {
                      file: relative(process.cwd(), args.path),
                      line: realStartLocation.line,
                      column: realStartLocation.column,
                      length,
                      lineText: input.slice(realStartNode.start - realStartLocation.column, realStartNode.end),
                      suggestion: 'Use expressions or observables',
                    },
                  });
                  return;
                }
                if (node.quasi.quasis?.length !== 1) {
                  warnings.push({
                    text: 'Cannot minify joined template expression',
                    location: {
                      file: relative(process.cwd(), args.path),
                    },
                  });
                  // warnings.push(relative(process.cwd(), args.path), 'Cannot minify joined:', contents.slice(node.start, node.end));
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
                  data = await minifyHTML(
                    htmlPreprocessor ? await htmlPreprocessor(raw) : raw,
                    {
                      caseSensitive: false,
                      collapseWhitespace: true,
                      collapseBooleanAttributes: false,
                      removeAttributeQuotes: true,
                      removeComments: true,
                    },
                  );
                } else {
                  const { code } = await esbuild.transform(
                    cssPreprocessor ? await cssPreprocessor(raw) : raw,
                    {
                      minify: build.initialOptions.minify,
                      minifyWhitespace: build.initialOptions.minifyWhitespace,
                      minifyIdentifiers: build.initialOptions.minifyIdentifiers,
                      minifySyntax: build.initialOptions.minifySyntax,
                      target: build.initialOptions.target,
                      loader: 'css',
                    },
                  );
                  data = code.trim();
                }

                return { data, type, raw, start, end };
              }),
            );
            for (const { data, start, end } of transformed.reverse()) {
              magicString.update(start, end, data);
            }

            if (transforms.length) {
              const map = magicString.generateMap({
                source: file,
                includeContent: true,
              });
              const sourceMapOutput = map.toString();

              const base64 = Buffer.from(sourceMapOutput).toString('base64');
              entry.output.contents = `${magicString.toString()}//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64}`;
            }
          }
          cache.set(key, entry);
        }

        return entry.output;
      });
    },
  };
}
