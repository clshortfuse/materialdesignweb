/* eslint-disable no-console -- Benchmark CLI reports results to stdout. */
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { build } from 'esbuild';
import { chromium, firefox, webkit } from 'playwright';

const browserTypes = { chromium, firefox, webkit };
const availableSuites = ['keyboard-nav', 'list-grid'];
const args = new Map(process.argv.slice(2).map((arg) => {
  const [name, value = 'true'] = arg.replace(/^--/, '').split('=', 2);
  return [name, value];
}));

if (args.has('help')) {
  console.log(`Usage: npm run benchmark:components -- [options]

Options:
  --suite=all                         Suite to run: all, keyboard-nav, or list-grid
  --browsers=chromium,firefox,webkit  Browsers to run
  --size=1000                         Keyboard targets or three-action ListGrid rows
  --samples=15                        Measured samples per scenario
  --warmups=3                         Warm-up samples per scenario
  --json=true                         Print machine-readable JSON`);
  // eslint-disable-next-line unicorn/no-process-exit -- Exit before benchmark setup.
  process.exit(0);
}

const requestedSuite = args.get('suite') ?? 'all';
if (requestedSuite !== 'all' && !availableSuites.includes(requestedSuite)) {
  throw new TypeError(`Unknown suite: ${requestedSuite}`);
}
const suiteNames = requestedSuite === 'all' ? availableSuites : [requestedSuite];
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
  import KeyboardNavMixin from './mixins/KeyboardNavMixin.js';
  import './components/ListGrid.js';

  CustomElement
    .extend()
    .mixin(KeyboardNavMixin)
    .html\`<slot id="slot"></slot>\`
    .register('mdw-keyboard-nav-runtime-benchmark');

  CustomElement
    .extend()
    .mixin(KeyboardNavMixin)
    .define({
      _kbdNavUsesDirectChildren() { return false; },
    })
    .methods({
      * getKbdNavChildren() {
        for (const child of this.children) {
          if (child instanceof HTMLElement && child.localName === 'button') yield child;
        }
      },
      _kbdOwnsKbdNavChild(child) {
        return child?.parentElement === this && child.localName === 'button';
      },
    })
    .html\`<slot id="slot"></slot>\`
    .register('mdw-keyboard-nav-custom-runtime-benchmark');

  const style = document.createElement('style');
  style.textContent = \`
    :is(mdw-keyboard-nav-runtime-benchmark, mdw-keyboard-nav-custom-runtime-benchmark),
    :is(mdw-keyboard-nav-runtime-benchmark, mdw-keyboard-nav-custom-runtime-benchmark) *,
    :is(mdw-keyboard-nav-runtime-benchmark, mdw-keyboard-nav-custom-runtime-benchmark) *::before,
    :is(mdw-keyboard-nav-runtime-benchmark, mdw-keyboard-nav-custom-runtime-benchmark) *::after {
      animation: none !important;
      transition: none !important;
    }
    :is(mdw-keyboard-nav-runtime-benchmark, mdw-keyboard-nav-custom-runtime-benchmark) {
      contain: strict;
      display: block;
      height: 1px;
      left: 0;
      overflow: hidden;
      position: fixed;
      top: 0;
      width: 1px;
    }
    :is(mdw-keyboard-nav-runtime-benchmark, mdw-keyboard-nav-custom-runtime-benchmark) button {
      height: 1px;
      left: 0;
      position: absolute;
      top: 0;
      width: 1px;
    }
    mdw-list-grid[data-runtime-benchmark] {
      contain: strict;
      display: block;
      height: 1px;
      left: 0;
      overflow: hidden;
      position: fixed;
      top: 0;
      width: 1px;
    }
  \`;
  document.head.append(style);

  function percentile(sorted, value) {
    return sorted[Math.min(Math.floor(sorted.length * value), sorted.length - 1)];
  }

  function summarize(name, operations, timings, counters) {
    const sorted = timings.slice().sort((a, b) => a - b);
    const total = sorted.reduce((sum, value) => sum + value, 0);
    const baselineCounters = JSON.stringify(counters[0]);
    if (counters.some((value) => JSON.stringify(value) !== baselineCounters)) {
      throw new Error(name + ' produced nondeterministic operation counts');
    }
    return {
      scenario: name,
      operations,
      medianMs: percentile(sorted, 0.5),
      p90Ms: percentile(sorted, 0.9),
      minMs: sorted[0],
      meanMs: total / sorted.length,
      counters: counters[0],
    };
  }

  async function settleMutations() {
    await Promise.resolve();
    await Promise.resolve();
  }

  function instrument(host) {
    const counters = {
      customOrderReads: 0,
      ownedOrderChecks: 0,
      reconciliations: 0,
    };
    const getKbdNavChildren = host.getKbdNavChildren;
    const ownsKbdNavChild = host._kbdOwnsKbdNavChild;
    const refreshTabIndexes = host.refreshTabIndexes;
    host.getKbdNavChildren = function getKbdNavChildrenCounter() {
      counters.customOrderReads += 1;
      return getKbdNavChildren.call(this);
    };
    host._kbdOwnsKbdNavChild = function ownsKbdNavChildCounter(child) {
      counters.ownedOrderChecks += 1;
      return ownsKbdNavChild.call(this, child);
    };
    host.refreshTabIndexes = function refreshTabIndexesCounter() {
      counters.reconciliations += 1;
      return refreshTabIndexes.call(this);
    };
    return counters;
  }

  function resetCounters(counters) {
    for (const name of Object.keys(counters)) counters[name] = 0;
  }

  function copyCounters(counters) {
    return { ...counters };
  }

  function requireCounter(counters, name, expected) {
    if (counters[name] !== expected) {
      throw new Error(name + ' expected ' + expected + ', found ' + counters[name]);
    }
  }

  function dispatchNavigation(target, key) {
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key,
    });
    target.dispatchEvent(event);
    if (!event.defaultPrevented) {
      throw new Error(key + ' was not handled for an owned target');
    }
  }

  async function createKeyboardFixture(targetCount, customOrder = false) {
    const host = document.createElement(customOrder
      ? 'mdw-keyboard-nav-custom-runtime-benchmark'
      : 'mdw-keyboard-nav-runtime-benchmark');
    const fragment = document.createDocumentFragment();
    const targets = [];
    for (let index = 0; index < targetCount; index += 1) {
      const target = document.createElement('button');
      target.textContent = 'target-' + index;
      targets.push(target);
      fragment.append(target);
    }
    const nestedContainer = document.createElement('div');
    for (let index = 0; index < targetCount; index += 1) {
      const decoy = document.createElement('button');
      decoy.textContent = 'nested-' + index;
      nestedContainer.append(decoy);
    }
    fragment.append(nestedContainer);
    host.append(fragment);
    document.body.append(host);
    await settleMutations();
    const counters = instrument(host);
    return { counters, host, nestedContainer, targets };
  }

  function validateLiveTopology(fixture, expectedTargets) {
    const { host, nestedContainer } = fixture;
    let ownedTargets = 0;
    let tabStops = 0;
    let activeTabStop = null;
    for (const target of host.children) {
      if (!(target instanceof HTMLElement) || !target.matches(host.kbdNavQuery)) continue;
      ownedTargets += 1;
      if (target.getAttribute('tabindex') === '0') {
        tabStops += 1;
        activeTabStop = target;
      }
    }
    if (ownedTargets !== expectedTargets) {
      throw new Error('expected ' + expectedTargets + ' live owned targets');
    }
    if (tabStops !== 1 || activeTabStop !== document.activeElement) {
      throw new Error('focus and the managed tab stop diverged');
    }
    if (nestedContainer.querySelector('[tabindex]')) {
      throw new Error('nested decoy received a managed tabindex');
    }
  }

  const keyboardScenarios = [
    {
      name: 'direct reconciliation',
      operations(targetCount) { return Math.max(1, Math.floor(targetCount / 100)); },
      async run(fixture, operations) {
        const { counters, host, targets } = fixture;
        targets[0].focus();
        resetCounters(counters);
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          host.refreshTabIndexes();
        }
        const elapsed = performance.now() - start;
        await settleMutations();
        requireCounter(counters, 'customOrderReads', 0);
        requireCounter(counters, 'reconciliations', operations);
        validateLiveTopology(fixture, host.children.length - 1);
        return elapsed;
      },
    },
    {
      name: 'steady keyboard movement',
      operations(targetCount) { return Math.ceil(targetCount / 2) * 4; },
      async run(fixture, operations) {
        const { counters, host, targets } = fixture;
        targets[0].focus();
        resetCounters(counters);
        const keys = ['ArrowDown', 'End', 'ArrowUp', 'Home'];
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          dispatchNavigation(document.activeElement, keys[index % keys.length]);
        }
        const elapsed = performance.now() - start;
        await settleMutations();
        const cycles = operations / keys.length;
        requireCounter(counters, 'customOrderReads', 0);
        requireCounter(counters, 'ownedOrderChecks', cycles * 8);
        validateLiveTopology(fixture, host.children.length - 1);
        return elapsed;
      },
    },
    {
      name: 'custom order with rejected candidate',
      customOrder: true,
      operations() { return 1; },
      async run(fixture, operations) {
        const { counters, host, targets } = fixture;
        targets[0].focus();
        targets[1].style.display = 'none';
        resetCounters(counters);
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          dispatchNavigation(targets[0], 'ArrowDown');
        }
        const elapsed = performance.now() - start;
        await settleMutations();
        requireCounter(counters, 'customOrderReads', operations * 2);
        requireCounter(counters, 'ownedOrderChecks', operations * 5);
        validateLiveTopology(fixture, host.children.length - 1);
        return elapsed;
      },
    },
    {
      name: 'idle topology churn',
      operations(targetCount) { return Math.max(1, Math.floor(targetCount / 10)); },
      async run(fixture, operations) {
        const { counters, host, targets } = fixture;
        let transient = null;
        targets[0].focus();
        resetCounters(counters);
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          if (transient) {
            transient.remove();
            transient = null;
          } else {
            transient = document.createElement('button');
            host.append(transient);
          }
        }
        transient?.remove();
        await settleMutations();
        const elapsed = performance.now() - start;
        requireCounter(counters, 'customOrderReads', 0);
        requireCounter(counters, 'ownedOrderChecks', 0);
        requireCounter(counters, 'reconciliations', 0);
        validateLiveTopology(fixture, host.children.length - 1);
        return elapsed;
      },
    },
    {
      name: 'live focus behavior',
      operations(targetCount) { return targetCount; },
      async run(fixture, operations) {
        const { counters, host, targets } = fixture;
        targets[0].focus();
        dispatchNavigation(targets[0], 'ArrowDown');
        resetCounters(counters);
        const target = targets[1];
        const focus = target.focus;
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          target.blur();
          target.focus = index % 2 ? focus : () => {};
          dispatchNavigation(targets[0], 'ArrowDown');
        }
        const elapsed = performance.now() - start;
        target.focus = focus;
        await settleMutations();
        requireCounter(counters, 'customOrderReads', 0);
        requireCounter(
          counters,
          'ownedOrderChecks',
          (operations * 2) + Math.ceil(operations / 2),
        );
        validateLiveTopology(fixture, host.children.length - 1);
        return elapsed;
      },
    },
    {
      name: 'topology burst then navigation',
      operations(targetCount) { return Math.max(1, Math.floor(targetCount / 10)); },
      async run(fixture, operations) {
        const { counters, host, targets } = fixture;
        targets[0].focus();
        dispatchNavigation(targets[0], 'ArrowDown');
        resetCounters(counters);
        let transient = null;
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          if (transient) {
            transient.remove();
            transient = null;
          } else {
            transient = document.createElement('button');
            host.append(transient);
          }
        }
        dispatchNavigation(document.activeElement, 'ArrowDown');
        const elapsed = performance.now() - start;
        transient?.remove();
        await settleMutations();
        requireCounter(counters, 'customOrderReads', 0);
        requireCounter(counters, 'ownedOrderChecks', 2);
        validateLiveTopology(fixture, targets.length);
        return elapsed;
      },
    },
  ];

  async function runKeyboardNavSuite(options) {
    const results = [];
    for (const scenario of keyboardScenarios) {
      const timings = [];
      const counterSamples = [];
      const operations = scenario.operations(options.targetCount);
      for (let index = -options.warmupCount; index < options.sampleCount; index += 1) {
        const fixture = await createKeyboardFixture(options.targetCount, scenario.customOrder);
        try {
          const elapsed = await scenario.run(fixture, operations);
          if (index >= 0) {
            timings.push(elapsed);
            counterSamples.push(copyCounters(fixture.counters));
          }
        } finally {
          fixture.host.remove();
          await settleMutations();
        }
        await new Promise(requestAnimationFrame);
      }
      results.push(summarize(scenario.name, operations, timings, counterSamples));
    }
    return results;
  }

  function instrumentListGrid(host) {
    const counters = {
      managedTabStops: 0,
    };
    return counters;
  }

  async function createListGridFixture(rowCount) {
    const host = document.createElement('mdw-list-grid');
    host.setAttribute('data-runtime-benchmark', '');
    const fragment = document.createDocumentFragment();
    const rows = [];
    for (let index = 0; index < rowCount; index += 1) {
      const row = document.createElement('mdw-list-row');
      row.setAttribute('actionable', '');
      row.append('row-' + index);
      for (let actionIndex = 0; actionIndex < 2; actionIndex += 1) {
        const cell = document.createElement('mdw-list-cell');
        cell.slot = 'trailing-action';
        const action = document.createElement('button');
        action.textContent = 'action-' + actionIndex;
        cell.append(action);
        row.append(cell);
      }
      rows.push(row);
      fragment.append(row);
    }
    host.append(fragment);
    document.body.append(host);
    await settleMutations();
    const counters = instrumentListGrid(host);
    return { counters, host, rows };
  }

  function validateListGridFixture(fixture, rowCount) {
    const { counters, host } = fixture;
    if (host.children.length !== rowCount) {
      throw new Error('expected ' + rowCount + ' direct grid rows');
    }
    for (const property of ['_gridRows', '_gridOwnedRows', '_gridRowIndexes', '_gridTargetPositions']) {
      if (property in host) throw new Error('ListGrid retained navigation topology in ' + property);
    }
    if ('_gridTabIndexWrites' in host) {
      throw new Error('ListGrid retained a mutation write ledger');
    }
    for (const row of fixture.rows) {
      for (const property of ['_listItemMutationObserver', '_trailingActions', '_gridActionCells', '_listGridOwner']) {
        if (property in row) throw new Error('ListRow retained observed action state in ' + property);
      }
      if ('_isGridRow' in row) throw new Error('ListRow retained a dynamic grid-role mode');
      for (const cell of row.querySelectorAll('mdw-list-cell')) {
        for (const property of ['_listGridMutationObserver', '_listGridOwner']) {
          if (property in cell) throw new Error('ListCell retained observed action state in ' + property);
        }
      }
    }
    let managedTabStops = 0;
    for (const target of host._kbdManagedTabIndexes?.keys() ?? []) {
      if (target.getAttribute('tabindex') === '0') managedTabStops += 1;
    }
    counters.managedTabStops = managedTabStops;
    if (managedTabStops !== 1) {
      throw new Error('expected one managed grid tab stop');
    }
  }

  function getFocusedGridTarget(host) {
    for (const target of host.getKbdNavChildren()) {
      if (target.matches(':focus')) return target;
    }
    return null;
  }

  const listGridScenarios = [
    {
      name: 'two-dimensional movement',
      operations() { return 10000; },
      async run(fixture, operations) {
        const { counters, host } = fixture;
        let [current] = host.getKbdNavChildren();
        current.focus();
        resetCounters(counters);
        const keys = ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          dispatchNavigation(current, keys[index % keys.length]);
          const next = getFocusedGridTarget(host);
          if (!next || next === current) {
            throw new Error('ListGrid navigation did not move focus');
          }
          current = next;
        }
        const elapsed = performance.now() - start;
        validateListGridFixture(fixture, fixture.rows.length);
        return elapsed;
      },
    },
    {
      name: 'live action replacement',
      operations() { return 1000; },
      async run(fixture, operations) {
        const { counters, rows } = fixture;
        resetCounters(counters);
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          const row = rows[index % rows.length];
          const cell = row.querySelector('mdw-list-cell');
          const action = document.createElement('button');
          action.textContent = 'replacement-' + index;
          cell.replaceChildren(action);
          const primary = row.shadowRoot.getElementById('primary-action');
          primary.focus();
          dispatchNavigation(primary, 'ArrowRight');
          if (!action.matches(':focus')) {
            throw new Error('ListGrid did not discover the replacement action');
          }
        }
        const elapsed = performance.now() - start;
        validateListGridFixture(fixture, rows.length);
        return elapsed;
      },
    },
    {
      name: 'row topology changes',
      operations() { return 100; },
      async run(fixture, operations) {
        const { counters, host, rows } = fixture;
        resetCounters(counters);
        const start = performance.now();
        for (let index = 0; index < operations; index += 1) {
          const row = rows.at(-1);
          if (row.isConnected) {
            row.remove();
          } else {
            host.append(row);
          }
          const current = rows[0].shadowRoot.getElementById('primary-action');
          current.focus();
          dispatchNavigation(current, 'ArrowDown');
        }
        const elapsed = performance.now() - start;
        validateListGridFixture(fixture, rows.length);
        return elapsed;
      },
    },
  ];

  async function runListGridSuite(options) {
    const results = [];
    for (const scenario of listGridScenarios) {
      const timings = [];
      const counterSamples = [];
      const operations = scenario.operations(options.targetCount);
      for (let index = -options.warmupCount; index < options.sampleCount; index += 1) {
        const fixture = await createListGridFixture(options.targetCount);
        try {
          const elapsed = await scenario.run(fixture, operations);
          if (index >= 0) {
            timings.push(elapsed);
            counterSamples.push(copyCounters(fixture.counters));
          }
        } finally {
          fixture.host.remove();
          await settleMutations();
        }
        await new Promise(requestAnimationFrame);
      }
      results.push(summarize(scenario.name, operations, timings, counterSamples));
    }
    return results;
  }

  window.runComponentBenchmark = async (options) => {
    const results = {};
    for (const suiteName of options.suiteNames) {
      if (suiteName === 'keyboard-nav') {
        results[suiteName] = await runKeyboardNavSuite(options);
      } else if (suiteName === 'list-grid') {
        results[suiteName] = await runListGridSuite(options);
      }
    }
    return results;
  };
`;

const temporaryDirectory = await mkdtemp(join(tmpdir(), 'mdw-component-benchmark-'));
const bundlePath = join(temporaryDirectory, 'benchmark.js');
let server;
/** @type {Array<{browser:string, version:string, suites:Record<string, any[]>}>} */
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
      sourcefile: 'mdw-component-runtime-benchmark.js',
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
      await page.waitForFunction(() => typeof window.runComponentBenchmark === 'function');
      const suites = await page.evaluate(
        (options) => window.runComponentBenchmark(options),
        { suiteNames, targetCount: size, sampleCount: samples, warmupCount: warmups },
      );
      report.push({ browser: browserName, version: browser.version(), suites });
    } finally {
      await browser.close();
    }
  }
  /* eslint-enable no-await-in-loop */

  if (args.get('json') === 'true') {
    console.log(JSON.stringify({ suites: suiteNames, size, samples, warmups, browsers: report }, null, 2));
  } else {
    console.log(`Component runtime benchmark: ${size} owned targets, ${samples} samples, ${warmups} warm-ups`);
    for (const { browser, version, suites } of report) {
      console.log(`\n${browser} ${version}`);
      for (const [suiteName, results] of Object.entries(suites)) {
        console.log(`\n${suiteName}`);
        console.table(results.map((result) => ({
          scenario: result.scenario,
          operations: result.operations,
          medianMs: result.medianMs.toFixed(2),
          p90Ms: result.p90Ms.toFixed(2),
          minMs: result.minMs.toFixed(2),
          meanMs: result.meanMs.toFixed(2),
          ...result.counters,
        })));
      }
    }
  }
} finally {
  await new Promise((resolve) => server?.close(resolve) ?? resolve());
  await rm(temporaryDirectory, { force: true, recursive: true });
}
