import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { build } from 'esbuild';
import { chromium, firefox, webkit } from 'playwright';

const browserTypes = { chromium, firefox, webkit };
const args = new Map(process.argv.slice(2).map((arg) => {
  const [name, value = 'true'] = arg.replace(/^--/, '').split('=', 2);
  return [name, value];
}));

if (args.has('help')) {
  console.log(`Usage: npm run benchmark:mdw-for -- [options]

Options:
  --browsers=chromium,firefox,webkit  Browsers to run
  --size=1000                         Existing row count
  --samples=15                        Measured samples per scenario
  --warmups=3                         Warm-up samples per scenario
  --json=true                         Print machine-readable JSON`);
  // eslint-disable-next-line unicorn/no-process-exit -- Exit before benchmark setup.
  process.exit(0);
}

const browserNames = (args.get('browsers') ?? 'chromium,firefox,webkit').split(',');
const size = Number(args.get('size') ?? 1000);
const samples = Number(args.get('samples') ?? 15);
const warmups = Number(args.get('warmups') ?? 3);
for (const [name, value] of Object.entries({ size, samples, warmups })) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`--${name} must be a positive integer`);
  }
}
if (size < 3) throw new TypeError('--size must be at least 3');
for (const name of browserNames) {
  if (!browserTypes[name]) throw new TypeError(`Unknown browser: ${name}`);
}

const benchmarkSource = `
  import CustomElement from './core/CustomElement.js';

  CustomElement
    .extend()
    .observe({
      data: { type: 'array', value: [] },
      state: { type: 'proxy', value: { items: [] } },
    })
    .html\`
      <div id="direct"><span mdw-for="{item of data}" class="row">{item.label}</span></div>
      <div id="proxy"><span mdw-for="{item of state.items}" class="row">{item.label}</span></div>
    \`
    .register('mdw-for-runtime-benchmark');

  function percentile(sorted, value) {
    return sorted[Math.min(Math.floor(sorted.length * value), sorted.length - 1)];
  }

  function summarize(name, timings) {
    const sorted = timings.slice().sort((a, b) => a - b);
    const total = sorted.reduce((sum, value) => sum + value, 0);
    return {
      scenario: name,
      medianMs: percentile(sorted, 0.5),
      p90Ms: percentile(sorted, 0.9),
      minMs: sorted[0],
      meanMs: total / sorted.length,
    };
  }

  function flush(host, target) {
    const container = host.shadowRoot.getElementById(target);
    void container.offsetHeight;
    return container;
  }

  function validate(container, target, expectedLength) {
    const rowCount = container.querySelectorAll(':scope > .row').length;
    if (rowCount !== expectedLength) {
      throw new Error(target + ' expected ' + expectedLength
        + ' rows, found ' + rowCount);
    }
  }

  window.runMdwForBenchmark = async ({ rowCount, sampleCount, warmupCount }) => {
    const base = Array.from({ length: rowCount }, (_, index) => ({
      id: index,
      label: 'row-' + index,
    }));
    const extra = Array.from({ length: rowCount }, (_, index) => ({
      id: rowCount + index,
      label: 'extra-' + index,
    }));
    const reverse = base.slice().reverse();
    const append = base.concat(extra);
    const head = [{ id: -1, label: 'head' }].concat(base);
    const host = document.createElement('mdw-for-runtime-benchmark');
    document.body.append(host);

    function prepareProxy(items) {
      host.state.items.splice(0);
      if (items.length) host.state.items.push(...items);
    }

    const scenarios = [
      {
        name: 'create direct rows', target: 'direct', prepared: 0, expected: rowCount,
        prepare() { host.data = []; },
        run() { host.data = base; },
      },
      {
        name: 'append direct rows', target: 'direct', prepared: rowCount, expected: rowCount * 2,
        prepare() { host.data = base; },
        run() { host.data = append; },
      },
      {
        name: 'prepend direct row', target: 'direct', prepared: rowCount, expected: rowCount + 1,
        prepare() { host.data = base; },
        run() { host.data = head; },
      },
      {
        name: 'reverse direct rows', target: 'direct', prepared: rowCount, expected: rowCount,
        prepare() { host.data = base; },
        run() { host.data = reverse; },
      },
      {
        name: 'sparse swap direct rows', target: 'direct', prepared: rowCount, expected: rowCount,
        prepare() { host.data = base.slice(); },
        run() {
          const last = rowCount - 2;
          [host.data[1], host.data[last]] = [host.data[last], host.data[1]];
          host.render({ data: { 1: host.data[1], [last]: host.data[last] } });
        },
      },
      {
        name: 'clear direct rows', target: 'direct', prepared: rowCount, expected: 0,
        prepare() { host.data = base; },
        run() { host.data = []; },
      },
      {
        name: 'proxy push rows', target: 'proxy', prepared: 0, expected: rowCount,
        prepare() { prepareProxy([]); },
        run() { host.state.items.push(...base); },
      },
      {
        name: 'proxy unshift row', target: 'proxy', prepared: rowCount, expected: rowCount + 1,
        prepare() { prepareProxy(base); },
        run() { host.state.items.unshift({ id: -1, label: 'head' }); },
      },
      {
        name: 'proxy reverse rows', target: 'proxy', prepared: rowCount, expected: rowCount,
        prepare() { prepareProxy(base); },
        run() { host.state.items.reverse(); },
      },
      {
        name: 'proxy middle splice', target: 'proxy', prepared: rowCount, expected: rowCount,
        prepare() { prepareProxy(base); },
        run() {
          const middle = Math.floor(rowCount / 2);
          host.state.items.splice(middle, 1, { id: -1, label: 'replacement' });
        },
      },
    ];

    const results = [];
    for (const scenario of scenarios) {
      const timings = [];
      for (let index = -warmupCount; index < sampleCount; index++) {
        scenario.prepare();
        validate(flush(host, scenario.target), scenario.target, scenario.prepared);
        const start = performance.now();
        scenario.run();
        const container = flush(host, scenario.target);
        const elapsed = performance.now() - start;
        validate(container, scenario.target, scenario.expected);
        if (index >= 0) timings.push(elapsed);
        await new Promise(requestAnimationFrame);
      }
      results.push(summarize(scenario.name, timings));
    }

    host.remove();
    return results;
  };
`;

const temporaryDirectory = await mkdtemp(join(tmpdir(), 'mdw-for-benchmark-'));
const bundlePath = join(temporaryDirectory, 'benchmark.js');
let server;
/** @type {Array<{browser:string, version:string, results:any[]}>} */
const report = [];

try {
  await build({
    bundle: true,
    drop: ['console'],
    entryNames: 'benchmark',
    format: 'esm',
    minify: true,
    outdir: temporaryDirectory,
    stdin: {
      contents: benchmarkSource,
      loader: 'js',
      resolveDir: process.cwd(),
      sourcefile: 'mdw-for-runtime-benchmark.js',
    },
    target: ['es2020'],
  });

  const bundle = await readFile(bundlePath);
  server = createServer((request, response) => {
    if (request.url === '/benchmark.js') {
      response.writeHead(200, { 'content-type': 'text/javascript' });
      response.end(bundle);
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end('<!doctype html><body><script type="module" src="/benchmark.js"></script>');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  /* eslint-disable no-await-in-loop -- Browsers run sequentially to avoid benchmark contention. */
  for (const browserName of browserNames) {
    const browser = await browserTypes[browserName].launch();
    try {
      const page = await browser.newPage();
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.waitForFunction(() => typeof window.runMdwForBenchmark === 'function');
      const results = await page.evaluate(
        (options) => window.runMdwForBenchmark(options),
        { rowCount: size, sampleCount: samples, warmupCount: warmups },
      );
      report.push({ browser: browserName, version: browser.version(), results });
    } finally {
      await browser.close();
    }
  }
  /* eslint-enable no-await-in-loop */

  if (args.get('json') === 'true') {
    console.log(JSON.stringify({ size, samples, warmups, browsers: report }, null, 2));
  } else {
    console.log(`mdw-for runtime benchmark: ${size} rows, ${samples} samples, ${warmups} warm-ups`);
    for (const { browser, version, results } of report) {
      console.log(`\n${browser} ${version}`);
      console.table(results.map((result) => ({
        scenario: result.scenario,
        medianMs: result.medianMs.toFixed(2),
        p90Ms: result.p90Ms.toFixed(2),
        minMs: result.minMs.toFixed(2),
      })));
    }
  }
} finally {
  await new Promise((resolve) => server?.close(resolve) ?? resolve());
  await rm(temporaryDirectory, { force: true, recursive: true });
}
