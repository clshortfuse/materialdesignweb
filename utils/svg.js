/**
 * Uses UTF-8 charset instead of base64 for better compression
 * @param {string} svg
 * @return {string}
 */
export function svgToCSSURL(svg) {
  return `url('data:image/svg+xml;charset=UTF-8,${svg
    .replaceAll('\n', ' ')
    .replaceAll('#', '%23')
    .replaceAll('(', '%28')
    .replaceAll(')', '%29')}')`;
}
