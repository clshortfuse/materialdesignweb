import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** @return {import('rollup').Plugin} */
export function writeMetafile() {
  return {
    name: 'writeMetafile',
    async writeBundle(options) {
      const deps = [];
      for (const id of this.getModuleIds()) {
        const m = this.getModuleInfo(id);
        if (m != null && !m.isExternal) {
          for (const target of m.importedIds) {
            deps.push({ source: m.id, target });
          }
        }
      }

      return await writeFile(
        join(options.dir, 'rollup.bundlebuddy.json'),
        JSON.stringify(deps),
      );
    },
  };
}
