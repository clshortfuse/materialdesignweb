/** @type {Set<string>} */
const generatedUIDs = new Set();

/** @return {string} */
export function generateUID() {
  const id = Math.random().toString(36).slice(2, 10);
  if (generatedUIDs.has(id)) {
    return generateUID();
  }
  generatedUIDs.add(id);
  return id;
}
