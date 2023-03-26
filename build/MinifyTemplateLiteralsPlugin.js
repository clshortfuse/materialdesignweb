import { readFile } from 'node:fs/promises';
import { basename, relative } from 'node:path';

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import esbuild from 'esbuild';
import { minify as minifyHTML } from 'html-minifier-terser';
import MagicString from 'magic-string';

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
        if (!build.initialOptions.minify && !build.initialOptions.minifyWhitespace
          && !build.initialOptions.minifyIdentifiers
          && !build.initialOptions.minifySyntax) {
          return { contents };
        }

        const file = basename(args.path);
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
        const magicString = new MagicString(contents);
        walk.simple(acorn.parse(contents, { ecmaVersion: 'latest', sourceType: 'module', locations: true }), {
          TaggedTemplateExpression(node) {
            if (node.quasi.expressions.length) {
              console.warn(relative(process.cwd(), args.path), '- Cannot minify complex:', contents.slice(node.start, node.end));
              return;
            }
            if (node.quasi.quasis?.length !== 1) {
              console.warn(relative(process.cwd(), args.path), 'Cannot minify joined:', contents.slice(node.start, node.end));
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
          magicString.update(start, end, data);
        }

        if (transforms.length) {
          const map = magicString.generateMap({
            source: file,
            includeContent: true,
          });
          const sourceMapOutput = map.toString();

          const base64 = Buffer.from(sourceMapOutput).toString('base64');
          contents = `${magicString.toString()}//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64}`;
        }

        value = { input, output: { contents } };
        cache.set(key, value);
      }

      return value.output;
    });
  },
};
