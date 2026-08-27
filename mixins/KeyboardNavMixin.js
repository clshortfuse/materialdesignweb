import { attemptFocus, isFocused, isRtl } from '../core/dom.js';

import AriaReflectorMixin from './AriaReflectorMixin.js';

const DEFAULT_ELEMENT_QUERY = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]',
].join(', ');

const FOCUS_RECEIPT_OPTIONS = Object.freeze({ capture: true, once: true, passive: true });

/** @param {HTMLElement & Record<string, any>} host */
function ariaOrientationIsVertical(host) {
  return (host.readAriaProperty('ariaOrientation')
    || host.ariaOrientationDefault) === 'vertical';
}

/** @param {HTMLElement & Record<string, any>} host @param {HTMLElement|null} child */
function ownsDirectKbdChild(host, child) {
  return child?.parentElement === host && child.matches(host.kbdNavQuery);
}

/** @param {HTMLElement & Record<string, any>} host @param {HTMLElement} child */
function kbdChildNavigable(host, child) {
  return host.kbdNavFocusableWhenDisabled
    || child.getAttribute('aria-disabled') !== 'true';
}

/** @param {HTMLElement & Record<string, any>} host @return {HTMLElement[]} */
function materializeKbdNavChildren(host) {
  const children = host.kbdNavChildren;
  return Array.isArray(children) ? children : [...children];
}

/**
 * @param {HTMLElement & Record<string, any>} host
 * @param {HTMLElement} child
 * @param {number} tabIndex
 */
function setKbdTabIndex(host, child, tabIndex) {
  if (host._setKbdTabIndex) { host._setKbdTabIndex(child, tabIndex); return; }
  host._kbdManagedTabIndexes ??= new Map();
  if (!host._kbdManagedTabIndexes.has(child)) {
    host._kbdManagedTabIndexes.set(child, child.getAttribute('tabindex'));
  }
  const newValue = `${tabIndex}`;
  if (child.getAttribute('tabindex') !== newValue) {
    child.tabIndex = tabIndex;
  }
}

/**
 * @param {HTMLElement & Record<string, any>} host
 * @param {HTMLElement|null} child
 * @param {boolean} reverse
 * @return {HTMLElement|null}
 */
function getKbdDirectSibling(host, child, reverse) {
  if (!ownsDirectKbdChild(host, child)) return null;
  /** @type {Element|null} */
  let candidate = child;
  do {
    candidate = reverse
      ? candidate?.previousElementSibling
      : candidate?.nextElementSibling;
  } while (candidate
    && (!(candidate instanceof HTMLElement)
      || !candidate.matches(host.kbdNavQuery)
      || !kbdChildNavigable(host, candidate)));
  return candidate instanceof HTMLElement ? candidate : null;
}

/**
 * @param {HTMLElement & Record<string, any>} host
 * @param {boolean} reverse
 * @return {HTMLElement|null}
 */
function getKbdDirectEdge(host, reverse) {
  /** @type {Element|null} */
  let candidate = reverse ? host.lastElementChild : host.firstElementChild;
  while (candidate
    && (!(candidate instanceof HTMLElement)
      || !candidate.matches(host.kbdNavQuery)
      || !kbdChildNavigable(host, candidate))) {
    candidate = reverse ? candidate.previousElementSibling : candidate.nextElementSibling;
  }
  return candidate instanceof HTMLElement ? candidate : null;
}

/** @param {HTMLElement & Record<string, any>} host @param {HTMLElement} child */
function restoreKbdTabIndex(host, child) {
  if (!host._kbdManagedTabIndexes?.has(child)) return;
  if (host._restoreKbdTabIndex) { host._restoreKbdTabIndex(child); return; }
  const tabIndex = host._kbdManagedTabIndexes.get(child);
  if (child.getAttribute('tabindex') !== tabIndex) {
    if (tabIndex == null) {
      child.removeAttribute('tabindex');
    } else {
      child.setAttribute('tabindex', tabIndex);
    }
  }
  host._kbdManagedTabIndexes.delete(child);
  if (host._kbdTabStop === child) {
    host._kbdTabStop = null;
  }
}

/**
 * @param {HTMLElement & Record<string, any>} host
 * @param {Set<HTMLElement>|null} [managedChildren]
 */
function restoreKbdTabIndexes(host, managedChildren = null) {
  if (!host._kbdManagedTabIndexes) return;
  for (const child of host._kbdManagedTabIndexes.keys()) {
    if (managedChildren?.has(child)) continue;
    restoreKbdTabIndex(host, child);
  }
}

/**
 * Move the managed tab stop.
 * @param {HTMLElement & Record<string, any>} host
 * @param {HTMLElement} child
 */
function setKbdTabStop(host, child) {
  const previousItem = host._kbdTabStop;
  if (previousItem && previousItem !== child) {
    if (host._kbdOwnsKbdNavChild(previousItem)
      && kbdChildNavigable(host, previousItem)) {
      setKbdTabIndex(host, previousItem, -1);
    } else {
      restoreKbdTabIndex(host, previousItem);
    }
  }
  setKbdTabIndex(host, child, 0);
  host._kbdTabStop = child;
}

/**
 * Reconcile roving tabindex over a current collection without retaining
 * that collection as navigation topology.
 * @param {HTMLElement & Record<string, any>} host
 * @param {Iterable<HTMLElement>} children
 */
function refreshKbdCustomTabIndexes(host, children = host.kbdNavChildren) {
  const managedChildren = new Set();
  for (const child of children) {
    managedChildren.add(child);
  }
  restoreKbdTabIndexes(host, managedChildren);
  let currentlyFocusedChild = null;
  let currentTabIndexChild = null;
  let firstChild = null;
  for (const child of managedChildren) {
    if (!kbdChildNavigable(host, child)) continue;
    if (!firstChild) {
      firstChild = child;
    }
    if (!currentlyFocusedChild && isFocused(child)) {
      currentlyFocusedChild = child;
    }
    if (!currentTabIndexChild && child.getAttribute('tabindex') === '0') {
      currentTabIndexChild = child;
    }
  }
  const activeChild = currentlyFocusedChild ?? currentTabIndexChild ?? firstChild;
  for (const child of managedChildren) {
    setKbdTabIndex(host, child, child === activeChild ? 0 : -1);
  }
  host._kbdTabStop = activeChild;
}

/**
 * Reconcile matching direct children through the live HTMLCollection.
 * @param {HTMLElement & Record<string, any>} host
 */
function refreshKbdDirectTabIndexes(host) {
  if (host._kbdManagedTabIndexes) {
    for (const child of host._kbdManagedTabIndexes.keys()) {
      if (!ownsDirectKbdChild(host, child)) {
        restoreKbdTabIndex(host, child);
      }
    }
  }
  /** @type {HTMLElement|null} */
  let activeChild = null;
  let activePriority = 0;
  for (const child of host.children) {
    if (!(child instanceof HTMLElement)
      || !ownsDirectKbdChild(host, child)) continue;
    if (!kbdChildNavigable(host, child)) {
      setKbdTabIndex(host, child, -1);
      continue;
    }
    let priority = child.getAttribute('tabindex') === '0' ? 2 : 1;
    if (isFocused(child)) {
      priority = 3;
    }
    if (priority > activePriority) {
      if (activeChild) {
        setKbdTabIndex(host, activeChild, -1);
      }
      activeChild = child;
      activePriority = priority;
    } else {
      setKbdTabIndex(host, child, -1);
    }
  }
  if (activeChild) {
    setKbdTabIndex(host, activeChild, 0);
  }
  host._kbdTabStop = activeChild;
}

/**
 * @param {HTMLElement & Record<string, any>} host
 * @param {HTMLElement|null} current
 * @param {boolean} loop
 * @param {boolean} reverse
 * @param {boolean} [fromEdge]
 * @return {HTMLElement|null}
 */
function focusNextKbdDirect(host, current, loop, reverse, fromEdge = false) {
  if (!fromEdge && (!current || !ownsDirectKbdChild(host, current))) {
    current = ownsDirectKbdChild(host, host._kbdTabStop)
      ? host._kbdTabStop
      : null;
  }
  /** @type {Set<HTMLElement>|null} */
  let attempted = null;
  let candidate = fromEdge
    ? getKbdDirectEdge(host, reverse)
    : (current
      ? getKbdDirectSibling(host, current, reverse)
      : getKbdDirectEdge(host, reverse));
  let wrapped = false;
  if (!candidate && loop && current && !fromEdge) {
    candidate = getKbdDirectEdge(host, reverse);
    wrapped = true;
  }
  while (candidate) {
    if (candidate === current || attempted?.has(candidate)) {
      candidate = getKbdDirectSibling(host, candidate, reverse);
      if (!candidate && loop && current && !wrapped && !fromEdge) {
        candidate = getKbdDirectEdge(host, reverse);
        wrapped = true;
      }
      continue;
    }
    const candidateNeighbor = reverse
      ? candidate.nextElementSibling
      : candidate.previousElementSibling;
    const focused = host._attemptKbdFocus(candidate);
    if (focused) return focused;
    if (!host.shouldUseKbdNav()) return null;
    attempted ??= new Set();
    attempted.add(candidate);
    const candidateStayed = candidate.parentElement === host
      && candidate.matches(host.kbdNavQuery)
      && (reverse
        ? candidate.nextElementSibling
        : candidate.previousElementSibling) === candidateNeighbor;
    if (candidateStayed) {
      candidate = getKbdDirectSibling(host, candidate, reverse);
    } else if (fromEdge) {
      candidate = getKbdDirectEdge(host, reverse);
    } else if (current?.parentElement === host && current.matches(host.kbdNavQuery)) {
      candidate = getKbdDirectSibling(host, current, reverse);
    } else {
      candidate = loop ? getKbdDirectEdge(host, reverse) : null;
    }
    if (!candidate && loop && current && !wrapped && !fromEdge) {
      candidate = getKbdDirectEdge(host, reverse);
      wrapped = true;
    }
  }
  return null;
}

/**
 * @param {HTMLElement & Record<string, any>} host
 * @param {HTMLElement|null} current
 * @param {boolean} loop
 * @param {boolean} reverse
 * @param {boolean} [fromEdge]
 * @param {HTMLElement[]} [children]
 * @return {HTMLElement|null}
 */
function focusNextKbdCustom(
  host,
  current,
  loop,
  reverse,
  fromEdge = false,
  children = materializeKbdNavChildren(host),
) {
  if (!children.length) return null;
  let currentIndex = fromEdge || !current ? -1 : children.indexOf(current);
  if (currentIndex < 0 && !fromEdge) {
    current = host._kbdTabStop;
    currentIndex = current ? children.indexOf(current) : -1;
  }
  let index = currentIndex >= 0 ? currentIndex : (reverse ? children.length : -1);
  const step = reverse ? -1 : 1;
  const candidateCount = currentIndex < 0 ? children.length : children.length - 1;
  for (let count = 0; count < candidateCount; count += 1) {
    index += step;
    if (index < 0 || index >= children.length) {
      if (!loop) break;
      index = reverse ? children.length - 1 : 0;
    }
    const focused = host._attemptKbdFocus(children[index]);
    if (focused) return focused;
    if (!host.shouldUseKbdNav()) return null;
  }
  return null;
}

/**
 * Adds keyboard roving navigation utilities for focus management within a list.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function KeyboardNavMixin(Base) {
  return Base
    .mixin(AriaReflectorMixin)
    .set({
      /** @type {Map<HTMLElement, string|null>|null} */
      _kbdManagedTabIndexes: null,

      /** @type {HTMLElement|null} */
      _kbdTabStop: null,

      /** @type {HTMLElement|null} */
      _kbdFocusAttemptTarget: null,
    })
    .observe({
      /** Enable keyboard roving navigation when present (set to 'true'). */
      kbdNav: { empty: 'true' },
    })
    .define({
      /**
       * Query used to find roving tab index children
       */
      kbdNavQuery() {
        return DEFAULT_ELEMENT_QUERY;
      },
      /** @deprecated Prefer platform focus delivery over attribute prediction. */
      kbdNavFocusableWhenDisabled() { return true; },
      /** @return {'horizontal'|'vertical'} */
      ariaOrientationDefault() { return 'vertical'; },
      /** Whether navigation order is the host's matching direct children. */
      _kbdNavUsesDirectChildren() { return true; },
    })
    .define({
      /**
       * List of roving tab index participating children
       * @return {Iterable<HTMLElement>}
       */
      kbdNavChildren() {
        return /** @type {Iterable<HTMLElement>} */ (/** @type {any} */ (this).getKbdNavChildren());
      },
    })
    .methods({
      /**
       * Effective keyboard-navigation activation hook.
       * Override this when a component needs to narrow `kbdNav` by role/state.
       * @return {boolean}
       */
      shouldUseKbdNav() {
        return this.kbdNav === 'true';
      },
      /** @return {boolean} */
      _shouldUseLinearKbdNav() {
        return this.shouldUseKbdNav();
      },
      /** @yields {HTMLElement} @return {Iterable<HTMLElement>} */
      * getKbdNavChildren() {
        for (const child of this.children) {
          if (child instanceof HTMLElement && child.matches(this.kbdNavQuery)) {
            yield child;
          }
        }
      },
      /**
       * Revalidates membership against the current consumer-owned order.
       * Custom-order consumers should override this with their ownership test.
       * @param {HTMLElement|null} child
       * @return {boolean}
       */
      _kbdOwnsKbdNavChild(child) {
        return this._kbdNavUsesDirectChildren && ownsDirectKbdChild(this, child);
      },
      /**
       * @param {Event} event
       * @param {boolean} [composed]
       * @return {HTMLElement|null}
       */
      _getKbdEventTarget(event, composed = false) {
        if (!this.shouldUseKbdNav()) return null;
        if (this._kbdNavUsesDirectChildren) {
          const target = event.target;
          return target instanceof HTMLElement
            && ownsDirectKbdChild(this, target)
            && kbdChildNavigable(this, target)
            ? target
            : null;
        }
        const targets = composed ? event.composedPath() : null;
        for (const child of this.kbdNavChildren) {
          if (kbdChildNavigable(this, child)
            && (targets ? targets.includes(child) : child === event.target)) return child;
        }
        return null;
      },
      /** @param {HTMLElement|null} child @param {...any} options @return {HTMLElement|null} */
      _attemptKbdFocus(child, ...options) {
        if (!child || !this.shouldUseKbdNav()) return null;
        if (!kbdChildNavigable(this, child)) {
          restoreKbdTabIndex(this, child);
          return null;
        }
        if (!this._kbdNavUsesDirectChildren && !this._kbdOwnsKbdNavChild(child)) {
          restoreKbdTabIndex(this, child);
          return null;
        }
        const previousTabStop = this._kbdTabStop;
        const previousTabStopFocused = isFocused(previousTabStop);
        let receivedFocus = false;
        const onFocus = () => { receivedFocus = true; };
        this._kbdFocusAttemptTarget = child;
        child.addEventListener('focus', onFocus, FOCUS_RECEIPT_OPTIONS);
        try {
          const focused = attemptFocus(child, ...options) || isFocused(child);
          const stillOwned = this._kbdOwnsKbdNavChild(child);
          const stillActive = this.shouldUseKbdNav();
          if (focused && stillOwned && stillActive) {
            setKbdTabStop(this, child);
            return child;
          }
          if (!stillOwned) {
            restoreKbdTabIndex(this, child);
          }
          if (!stillActive) return null;
          const redirected = this._kbdTabStop;
          return redirected !== child
            && isFocused(redirected)
            && (redirected !== previousTabStop || !previousTabStopFocused)
            && this._kbdOwnsKbdNavChild(redirected)
            ? redirected
            : (receivedFocus ? child : null);
        } finally {
          child.removeEventListener('focus', onFocus, true);
          this._kbdFocusAttemptTarget = null;
        }
      },
      /** @param {...any} options @return {HTMLElement|null} */
      focusCurrentOrFirst(...options) {
        if (!this.shouldUseKbdNav()) return null;
        const direct = this._kbdNavUsesDirectChildren;
        const children = direct ? this.children : materializeKbdNavChildren(this);
        let current = null;
        for (const candidate of children) {
          if (!(candidate instanceof HTMLElement)) continue;
          if (direct && !ownsDirectKbdChild(this, candidate)) continue;
          if (!kbdChildNavigable(this, candidate)) continue;
          if (candidate.getAttribute('tabindex') === '0') {
            current = candidate;
            break;
          }
        }
        const focusedCurrent = this._attemptKbdFocus(current, ...options);
        if (focusedCurrent) return focusedCurrent;
        if (!this.shouldUseKbdNav()) return null;
        if (direct) {
          return focusNextKbdDirect(this, current, true, false);
        }
        for (const candidate of children) {
          if (!(candidate instanceof HTMLElement)
            || candidate === current) continue;
          const focused = this._attemptKbdFocus(candidate);
          if (focused) return focused;
          if (!this.shouldUseKbdNav()) return null;
        }
        return null;
      },
      /**
       * Focuses next element participating in roving tab index list
       * @param {HTMLElement} [current]
       * @param {boolean} [loop=true]
       * @param {boolean} [reverse]
       * @return {HTMLElement|null} focusedElement
       */
      focusNext(current = null, loop = true, reverse = false) {
        if (!this.shouldUseKbdNav()) return null;
        return this._kbdNavUsesDirectChildren
          ? focusNextKbdDirect(this, current, loop, reverse)
          : focusNextKbdCustom(this, current, loop, reverse);
      },

      /**
       * Alias for focusNext(list, current, true).
       * Selects previous element
       * @param {HTMLElement} [current]
       * @param {boolean} [loop=true]
       * @return {HTMLElement|null}
       */
      focusPrevious(current, loop = true) {
        return this.focusNext(current, loop, true);
      },

      /** @return {HTMLElement|null} */
      focusFirst() {
        if (!this.shouldUseKbdNav()) return null;
        return this._kbdNavUsesDirectChildren
          ? focusNextKbdDirect(this, null, false, false, true)
          : focusNextKbdCustom(this, null, false, false, true);
      },

      /** @return {HTMLElement|null} */
      focusLast() {
        if (!this.shouldUseKbdNav()) return null;
        return this._kbdNavUsesDirectChildren
          ? focusNextKbdDirect(this, null, false, true, true)
          : focusNextKbdCustom(this, null, false, true, true);
      },

      /** @type {HTMLElement['focus']} */
      focus(...options) {
        if (!this.shouldUseKbdNav()) {
          HTMLElement.prototype.focus.call(this, ...options);
          return;
        }
        const children = this._kbdNavUsesDirectChildren
          ? null
          : materializeKbdNavChildren(this);
        const tabStop = this._kbdTabStop;
        if (!children) {
          if (tabStop instanceof HTMLElement
            && ownsDirectKbdChild(this, tabStop)) {
            if (this._attemptKbdFocus(tabStop, ...options)) return;
            focusNextKbdDirect(this, tabStop, true, false);
            return;
          }
          this.focusCurrentOrFirst(...options);
          return;
        }
        if (tabStop instanceof HTMLElement
          && children.includes(tabStop)
          && this._attemptKbdFocus(tabStop, ...options)) return;
        for (const candidate of children) {
          if (candidate.getAttribute('tabindex') !== '0') continue;
          if (this._attemptKbdFocus(candidate, ...options)) return;
        }
        focusNextKbdCustom(this, null, true, false, false, children);
      },

      /**
       * Refreshes roving tab index attributes based on kbdNavChildren
       */
      refreshTabIndexes() {
        if (!this.shouldUseKbdNav()) {
          restoreKbdTabIndexes(this);
          this._kbdTabStop = null;
          return;
        }
        if (this._kbdNavUsesDirectChildren) {
          refreshKbdDirectTabIndexes(this);
        } else {
          refreshKbdCustomTabIndexes(this);
        }
      },

    })
    .events({
      focusin(event) {
        if (!this.shouldUseKbdNav()) return;
        if (event.target === this._kbdFocusAttemptTarget) return;
        const currentItem = this._getKbdEventTarget(event, true);
        if (currentItem && currentItem !== this._kbdFocusAttemptTarget) {
          setKbdTabStop(this, currentItem);
        }
      },
      keydown(event) {
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
        if (!this._shouldUseLinearKbdNav()) return;

        let focused = null;
        let current = null;
        switch (event.key) {
          case 'ArrowUp':
          case 'Up':
            if (ariaOrientationIsVertical(this)) {
              current = this._getKbdEventTarget(event);
              if (!current) return;
              focused = this.focusPrevious(current);
            }
            break;
          case 'ArrowDown':
          case 'Down':
            if (ariaOrientationIsVertical(this)) {
              current = this._getKbdEventTarget(event);
              if (!current) return;
              focused = this.focusNext(current);
            }
            break;
          case 'ArrowLeft':
          case 'Left':
            if (ariaOrientationIsVertical(this)) return;
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = isRtl(this) ? this.focusNext(current) : this.focusPrevious(current);
            break;
          case 'ArrowRight':
          case 'Right':
            if (ariaOrientationIsVertical(this)) return;
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = isRtl(this) ? this.focusPrevious(current) : this.focusNext(current);
            break;
          case 'Home':
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = this.focusFirst();
            break;
          case 'End':
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = this.focusLast();
            break;
          default:
            return;
        }
        if (!focused || focused === current) return;
        event.stopPropagation(); // Avoid kbd within kbd (sub menus)
        event.preventDefault();
      },
    })
    .on({
      kbdNavChanged() {
        if (this.isConnected) {
          this.refreshTabIndexes();
        }
      },
      connected() {
        this.refreshTabIndexes();
      },
      disconnected() {
        restoreKbdTabIndexes(this);
        this._kbdTabStop = null;
      },
    });
}
