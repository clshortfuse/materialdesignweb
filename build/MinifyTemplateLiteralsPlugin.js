import { readFile } from 'node:fs/promises';

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import esbuild from 'esbuild';
import { minify as minifyHTML } from 'html-minifier-terser';

/** @type {import('esbuild').Plugin} */
export default {
  name: 'minify template literals',
  setup(build) {
    const cache = new Map();
    build.onLoad({ filter: /\.js$/ }, async (args) => {
      const input = await readFile(args.path, 'utf8');
      const key = args.path;
      let value = cache.get(key);

      if (!value || value.input !== input) {
        let contents = input;
        /**
         * @type {{
         *  type: string,
         *  raw: string,
         *  start: number,
         *  end: number,
         *  data?: string
         * }[]}
         */
        const transforms = [];
        walk.simple(acorn.parse(contents, { ecmaVersion: 'latest', sourceType: 'module', locations: true }), {
          TaggedTemplateExpression(node) {
            if (node.quasi.expressions.length) return;
            if (node.quasi.quasis?.length !== 1) return;

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
            // console.log('Minified CSS', end - start, 'bytes to', code.trim().length);
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
              });
            } else {
              const { code } = await esbuild.transform(raw, {
                minify: build.initialOptions.minify,
                minifyWhitespace: build.initialOptions.minifyWhitespace,
                minifyIdentifiers: build.initialOptions.minifyIdentifiers,
                minifySyntax: build.initialOptions.minifySyntax,
                target: build.initialOptions.target,
                loader: 'css',
              });
              data = code.trim();
            }

            return { data, type, raw, start, end };
          }),
        );
        for (const { data, start, end } of transformed.reverse()) {
          contents = contents.slice(0, start) + data + contents.slice(end);
        }
        value = { input, output: { contents } };
        cache.set(key, value);
      }

      return value.output;
    });
  },
};
