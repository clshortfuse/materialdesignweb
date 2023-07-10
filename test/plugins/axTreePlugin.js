/** @typedef {import('@web/test-runner-playwright').PlaywrightLauncher} PlaywrightLauncher */
/** @typedef {import('@web/test-runner-playwright').playwright} playwright */
/** @typedef {import('@web/test-runner-chrome').puppeteerCore} puppeteerCore */
/** @typedef {import('@web/test-runner-chrome').ChromeLauncher} ChromeLauncher */

/** @typedef {{ selector?: string }} AxTreePayload  */

/**
 * @return {import('@web/test-runner-core').TestRunnerPlugin<AxTreePayload>}
 */
export function axTreePlugin() {
  return {
    name: 'ax-tree-command',
    async executeCommand({ command, payload, session }) {
      if (command !== 'ax-tree') return undefined;
      // handle specific behavior for playwright
      if (session.browser.type === 'playwright') {
        const launcher = /** @type {PlaywrightLauncher} */ (session.browser);
        const page = launcher.getPage(session.id);
        let root;
        switch (session.browser.name) {
          case 'Firefox':
            if (payload?.selector) {
              root = await page.$(payload.selector);
            }
            break;
          case 'Chromium':
            await page.waitForTimeout(100); // Fixes flaky Chrome test
            // Fallthrough
          default:
            if (payload?.selector) {
              root = page.locator(payload.selector);
            }
            break;
        }

        const snapshot = await page.accessibility.snapshot({
          interestingOnly: false,
          root,
        });

        if (!snapshot) {
          if (root) {
            // Elements that do not expose an accessibility tree return null
            return {};
          }
          throw new Error('Accessibility snapshot failed.');
        }
        return snapshot;
      }

      // handle specific behavior for puppeteer
      if (session.browser.type === 'puppeteer') {
        const launcher = /** @type {ChromeLauncher} */ (session.browser);
        const page = launcher.getPage(session.id);

        const snapshot = await page.accessibility.snapshot({
          interestingOnly: false,
          root: payload?.selector ? await page.$(payload.selector) : undefined,
        });

        if (!snapshot) {
          throw new Error('Accessibility snapshot failed.');
        }
        return snapshot;
      }

      // you might not be able to support all browser launchers
      throw new Error(
        `AX Tree is not supported for browser type ${session.browser.type}.`,
      );
    },
  };
}
