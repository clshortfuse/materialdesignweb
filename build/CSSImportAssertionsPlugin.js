import esbuild from 'esbuild';

/** @type {import('esbuild').Plugin} */
export default {
  name: 'css import assertions',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const { outputFiles } = await esbuild.build({
        entryPoints: [args.path],
        bundle: true,
        minify: build.initialOptions.minify,
        minifyWhitespace: build.initialOptions.minifyWhitespace,
        minifyIdentifiers: build.initialOptions.minifyIdentifiers,
        minifySyntax: build.initialOptions.minifySyntax,
        target: build.initialOptions.target,
        write: false,
      });
      const [file] = outputFiles;
      const { text } = file;
      const jsText = text.trim()
        .replaceAll(/`/g, '\\`')
        .replaceAll(/\\([\da-f]+)/gi, (match, p1) => String.fromCodePoint(Number.parseInt(p1, 16)));
      const contents = /* js */ `
        let contents = \`${jsText}\`;
        let sheet;
        try {
          sheet = new CSSStyleSheet();
          sheet.replaceSync(contents);
        } catch (e) {
          const doc = document.implementation.createHTMLDocument()
          const style = doc.createElement('style');
          style.textContent = contents;
          doc.head.append(style);
          sheet = style.sheet;
          // Note: Removing style from document will nullify sheet
        }
        export default sheet;`;
      return { contents };
    });
  },
};
