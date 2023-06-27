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
        await page.waitForTimeout(100); // Fixes flaky Chrome test
        return await page.accessibility.snapshot({
          interestingOnly: false,
          root: payload?.selector ? await page.$(payload.selector) : undefined,
        });
      }

      // handle specific behavior for puppeteer
      if (session.browser.type === 'puppeteer') {
        const launcher = /** @type {ChromeLauncher} */ (session.browser);
        const page = launcher.getPage(session.id);

        return await page.accessibility.snapshot({
          interestingOnly: false,
          root: payload?.selector ? await page.$(payload.selector) : undefined,
        });
      }

      // you might not be able to support all browser launchers
      throw new Error(
        `AX Tree is not supported for browser type ${session.browser.type}.`,
      );
    },
  };
}
