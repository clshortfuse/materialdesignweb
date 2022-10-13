/** @return {URLSearchParams} */
export function getSearchParams() {
  const searchParams = new URLSearchParams();
  for (const args of process.argv.slice(2)) {
    if (!args.startsWith('--')) continue;
    const [key, ...values] = args.split('=');
    const value = values ? values.join('=') : '';
    searchParams.append(key.slice(2), value);
  }
  return searchParams;
}
