/// <reference types="webdriverio/async"/>

import { remote } from 'webdriverio';

import StaticServer from './StaticServer.js';

export default class E2ETester {
  constructor() {
    this.staticServer = new StaticServer();
    this.browser = null;
  }

  /**
   * @param {import('tap')} tap
   */
  setupTap(tap) {
    this.port = StaticServer.HTTP_PORT + (+process.env.TAP_CHILD_ID);
    tap.before(() => this.start());
    tap.beforeEach(async () => {
      await this.browser.execute(() => {
        let child;
        while ((child = document.body.lastChild) != null) {
          child.remove();
        }
      });
    });
    tap.teardown(() => this.stop());
  }

  /**
   * @param {string} html
   * @return {Promise<WebdriverIO.Element[]>}
   */
  async addHTML(html) {
    const results = await this.browser.execute((fragmentString) => {
      const fragment = document.createRange().createContextualFragment(fragmentString);
      const children = [...fragment.children];
      document.body.appendChild(fragment);
      return children;
    }, html);

    return await Promise.all(results.map((object) => this.browser.$(object)));
  }

  /**
   * @param {WebdriverIO.Element|string} element
   * @param {keyof HTMLElement['style']} style
   * @return {Promise<string>}
   */
  async getStyle(element, style) {
    const el = (typeof element === 'string') ? await this.browser.$(element) : element;
    const { value } = await el.getCSSProperty(style);
    return value;
  }

  /**
   * @template {(P extends WebdriverIO.Element ? HTMLElement : any)[]} P
   * @template {(...args: P) => any} T
   * @param {T} fn
   * @param  {P} [args]
   * @return {Promise<ReturnType<T> extends (HTMLElement|Element) ? WebdriverIO.Element : ReturnType<T>>}
   */
  async js(fn, ...args) {
    return await this.browser.execute(fn, ...args);
  }

  async start() {
    await this.staticServer.start(this.port);
    const url = new URL('test/fixtures/blank.html', `http://localhost:${this.port}/`).toString();
    try {
      this.browser = await remote({
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: ['--headless'],
          },
        },
      });
      this.$ = this.browser.$;
      await this.browser.navigateTo(url);
    } catch (e) {
      await this.browser?.deleteSession();
      throw e;
    }
  }

  async stop() {
    try {
      await this.browser?.deleteSession();
    } finally {
      await this.staticServer?.stop();
    }
  }
}
