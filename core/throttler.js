export default class Throttler {
  /** @param {number} throttleTimeMs */
  constructor(throttleTimeMs) {
    this.pending = false;
    this.queued = false;
    this.queue = null;
    this.throttleTimeMs = throttleTimeMs;
  }

  abort() {
    if (this.queue) {
      clearTimeout(this.queue);
      this.queue = null;
    }
    this.pending = false;
    this.queued = false;
  }

  /**
   * @param {function} fn
   * @return {void}
   */
  run(fn) {
    if (this.pending) {
      this.queued = true;
      return;
    }
    if (this.queue) {
      clearTimeout(this.queue);
      this.queue = null;
    }
    this.queued = false;
    this.pending = true;
    this.queue = setTimeout(() => {
      this.pending = false;
      if (this.queued) {
        this.run(fn);
      }
    }, this.throttleTimeMs);
    fn();
  }
}
