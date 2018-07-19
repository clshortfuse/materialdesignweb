import { getChildElementByClass, findElementParentByClassName, dispatchDomEvent } from '../common/dom';

class NavDrawerStack {
  /**
   * @param {Element} element
   * @param {Object=} state
   * @param {Object=} previousState
   */
  constructor(element, state, previousState) {
    this.element = element;
    this.state = state;
    this.previousState = previousState;
  }
}

/** @type {NavDrawerStack[]} */
const OPEN_NAV_DRAWERS = [];
class NavDrawer {
  /**
   * @param {Element} navDrawerElement
   * @return {void}
   */
  static attach(navDrawerElement) {
    let scrim = getChildElementByClass(navDrawerElement, 'mdw-navdrawer__scrim');
    const openButton = navDrawerElement.getElementsByClassName('mdw-navdrawer__open')[0];
    const closeButton = navDrawerElement.getElementsByClassName('mdw-navdrawer__close')[0];
    const toggleButton = navDrawerElement.getElementsByClassName('mdw-navdrawer__toggle')[0];
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.classList.add('mdw-navdrawer__scrim');
      navDrawerElement.insertBefore(scrim, navDrawerElement.firstChild);
    }
    if (openButton) {
      openButton.addEventListener('click', NavDrawer.onOpenButtonClick);
    }
    if (closeButton) {
      closeButton.addEventListener('click', NavDrawer.onCloseButtonClick);
    }
    if (toggleButton) {
      toggleButton.addEventListener('click', NavDrawer.onToggleButtonClick);
    }

    scrim.addEventListener('click', NavDrawer.onScrimClick);
    navDrawerElement.setAttribute('mdw-js', '');
  }

  static detach(navDrawerElement) {
    const scrim = getChildElementByClass(navDrawerElement, 'mdw-navdrawer__scrim');
    const openButton = navDrawerElement.getElementsByClassName('mdw-navdrawer__open')[0];
    const closeButton = navDrawerElement.getElementsByClassName('mdw-navdrawer__close')[0];
    const toggleButton = navDrawerElement.getElementsByClassName('mdw-navdrawer__toggle')[0];
    if (scrim) {
      scrim.removeEventListener('click', NavDrawer.onScrimClick);
    }
    if (openButton) {
      openButton.removeEventListener('click', NavDrawer.onOpenButtonClick);
    }
    if (closeButton) {
      closeButton.removeEventListener('click', NavDrawer.onCloseButtonClick);
    }
    if (toggleButton) {
      toggleButton.removeEventListener('click', NavDrawer.onToggleButtonClick);
    }
    navDrawerElement.removeAttribute('mdw-js');
    navDrawerElement.removeAttribute('mdw-show');
    navDrawerElement.removeAttribute('mdw-hide');
  }

  static onScrimClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    const navdrawerElement = findElementParentByClassName(event.currentTarget, 'mdw-navdrawer');
    NavDrawer.close(navdrawerElement);
  }

  static onOpenButtonClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    const navdrawerElement = findElementParentByClassName(event.currentTarget, 'mdw-navdrawer');
    NavDrawer.open(navdrawerElement);
  }

  static onCloseButtonClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    const navdrawerElement = findElementParentByClassName(event.currentTarget, 'mdw-navdrawer');
    NavDrawer.close(navdrawerElement);
  }

  static onToggleButtonClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    const navdrawerElement = findElementParentByClassName(event.currentTarget, 'mdw-navdrawer');
    if (NavDrawer.open(navdrawerElement)) {
      return;
    }
    NavDrawer.close(navdrawerElement);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    if (!event.state) {
      return;
    }
    const lastOpenNavDrawer = OPEN_NAV_DRAWERS[OPEN_NAV_DRAWERS.length - 1];
    if (!lastOpenNavDrawer || !lastOpenNavDrawer.previousState) {
      return;
    }
    if ((lastOpenNavDrawer.previousState === event.state) || Object.keys(event.state)
      .every(key => event.state[key] === lastOpenNavDrawer.previousState[key])) {
      NavDrawer.close(lastOpenNavDrawer.element);
    }
  }

  /**
   * @param {Element} navDrawerElement
   * @return {boolean} handled
   */
  static close(navDrawerElement) {
    if (!navDrawerElement.hasAttribute('mdw-hide')) {
      navDrawerElement.setAttribute('mdw-hide', '');
      let stackIndex = -1;
      OPEN_NAV_DRAWERS.some((stack, index) => {
        if (stack.element === navDrawerElement) {
          stackIndex = index;
          return true;
        }
        return false;
      });
      if (stackIndex !== -1) {
        const stack = OPEN_NAV_DRAWERS[stackIndex];
        OPEN_NAV_DRAWERS.splice(stackIndex, 1);
        if (stack.state && window.history && window.history.state) {
          // IE11 returns a cloned state object, not the original
          if (stack.state.hash === window.history.state.hash) {
            window.history.back();
          }
        }
      }
      if (!OPEN_NAV_DRAWERS.length) {
        window.removeEventListener('popstate', NavDrawer.onPopState);
      }
      dispatchDomEvent(navDrawerElement, 'mdw:close');
      return true;
    }
    return false;
  }

  /**
   * @param {Element} navDrawerElement
   * @param {MouseEvent=} event
   * @return {boolean} handled
   */
  static open(navDrawerElement, event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      // Prevent anchor link
      event.preventDefault();
    }
    let changed = false;
    if (navDrawerElement.hasAttribute('mdw-hide')) {
      navDrawerElement.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!navDrawerElement.hasAttribute('mdw-show')) {
      navDrawerElement.setAttribute('mdw-show', '');
      changed = true;
    }
    if (changed) {
      NavDrawer.attach(navDrawerElement);
      const newState = { hash: Math.random().toString(36).substr(2, 16) };
      let previousState = null;
      if (window.history && window.history.pushState) {
        if (!window.history.state) {
          // Create new previous state
          window.history.replaceState({
            hash: Math.random().toString(36).substr(2, 16),
          }, document.title);
        }
        previousState = window.history.state;
        window.history.pushState(newState, document.title);
        window.addEventListener('popstate', NavDrawer.onPopState);
      }
      const navDrawerStack = new NavDrawerStack(navDrawerElement, newState, previousState);
      OPEN_NAV_DRAWERS.push(navDrawerStack);
      dispatchDomEvent(navDrawerElement, 'mdw:open');
    }
    return changed;
  }
}

export {
  NavDrawer,
};
