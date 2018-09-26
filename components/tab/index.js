import { Ripple } from '../ripple/index';
import { findElementParentByClassName, isRtl, nextTick } from '../common/dom';

class TabItem {
  /**
   * @param {Element} tabItemElement
   * @return {void}
   */
  static attach(tabItemElement) {
    Ripple.attach(tabItemElement);
  }

  /**
   * @param {Element} tabItemElement
   * @return {void}
   */
  static detach(tabItemElement) {
    Ripple.detach(tabItemElement);
  }
}

class Tab {
  /**
   * @param {Element} tabElement
   * @return {void}
   */
  static attach(tabElement) {
    const tabItemsElement = tabElement.getElementsByClassName('mdw-tab__items')[0];
    let indicatorElement = tabItemsElement.getElementsByClassName('mdw-tab__indicator')[0];
    if (!indicatorElement) {
      indicatorElement = document.createElement('div');
      indicatorElement.classList.add('mdw-tab__indicator');
      tabItemsElement.appendChild(indicatorElement);
    }

    const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
    if (tabContentElement) {
      tabContentElement.addEventListener('scroll', Tab.onTabContentScroll);
    }

    const inputs = tabElement.getElementsByClassName('mdw-tab__input');
    const items = tabElement.getElementsByClassName('mdw-tab__item');

    let foundChecked = false;
    for (let i = 0; i < inputs.length; i += 1) {
      const inputElement = inputs[i];
      if (inputElement.checked) {
        foundChecked = true;
        Tab.onInputChanged({ currentTarget: inputElement });
      }
      inputElement.addEventListener('change', Tab.onInputChanged);
    }
    if (!foundChecked && inputs.length) {
      inputs[0].checked = true;
      Tab.onInputChanged({ currentTarget: inputs[0] });
    }

    let foundSelected = false;
    for (let i = 0; i < items.length; i += 1) {
      const itemElement = items[i];
      TabItem.attach(itemElement);
      if (itemElement.hasAttribute('mdw-selected')) {
        foundSelected = true;
        Tab.selectItem(itemElement);
      }
      itemElement.addEventListener('click', Tab.onItemClicked);
    }
    if (!foundSelected && items.length) {
      Tab.selectItem(items[0]);
    }
  }

  /**
   * @param {Element} tabElement
   * @return {void}
   */
  static detach(tabElement) {
    const inputs = tabElement.getElementsByClassName('mdw-tab__input');
    const items = tabElement.getElementsByClassName('mdw-tab__item');
    const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
    const tabContentItems = tabElement.getElementsByClassName('mdw-tab__content-item');

    for (let i = 0; i < inputs.length; i += 1) {
      const inputElement = inputs[i];
      inputElement.removeEventListener('change', Tab.onInputChanged);
    }

    for (let i = 0; i < items.length; i += 1) {
      const itemElement = items[i];
      TabItem.detach(itemElement);
      itemElement.removeEventListener('click', Tab.onItemClicked);
      itemElement.removeAttribute('mdw-selected');
    }

    if (tabContentElement) {
      tabContentElement.removeAttribute('mdw-selected-index');
      tabContentElement.removeEventListener('scroll', Tab.onTabContentScroll);
    }
    for (let i = 0; i < tabContentItems.length; i += 1) {
      const itemElement = tabContentItems[i];
      itemElement.removeAttribute('mdw-selected');
    }
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onTabContentScroll(event) {
    /** @type {HTMLElement} */
    const tabContentElement = (event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
    tabContentElement.scrollLeft = 0;
    nextTick(() => {
      tabContentElement.scrollLeft = 0;
    });
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onItemClicked(event) {
    /** @type {HTMLElement} */
    const itemElement = (event.currentTarget);
    if (!itemElement) {
      return;
    }
    if (itemElement instanceof HTMLLabelElement) {
      // Fixes ripple animation
      const inputElement = document.getElementById(itemElement.getAttribute('for'));
      if (inputElement && inputElement instanceof HTMLInputElement) {
        inputElement.checked = true;
      }
    }

    Tab.selectItem(itemElement);
    const tabItemsElement = findElementParentByClassName(itemElement, 'mdw-tab__items', false);
    if (tabItemsElement && tabItemsElement.hasAttribute('mdw-scrollable')) {
      itemElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  static onInputChanged(event) {
    const inputElement = event.currentTarget;
    if (!inputElement.id) {
      return;
    }
    const itemElement = document.querySelector(`label.mdw-tab__item[for="${inputElement.id}"]`);
    if (itemElement) {
      Tab.selectItem(itemElement);
    }
  }

  /**
   * @param {Element} itemElement
   * @return {void}
   */
  static selectItem(itemElement) {
    const tabElement = findElementParentByClassName(itemElement, 'mdw-tab');
    if (!tabElement) {
      return;
    }
    const tabItemsElement = findElementParentByClassName(itemElement, 'mdw-tab__items');
    if (!tabItemsElement) {
      return;
    }
    const tabItems = tabItemsElement.getElementsByClassName('mdw-tab__item');
    const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
    let foundPreviousSelection = false;
    let foundTarget = false;
    let left = 0;
    let contentItems = null;
    if (tabContentElement) {
      contentItems = tabContentElement.getElementsByClassName('mdw-tab__content-item');
    }
    const isRtlValue = isRtl();
    for (let i = 0; i < tabItems.length; i += 1) {
      const index = isRtlValue ? tabItems.length - 1 - i : i;
      const tabItem = tabItems.item(index);
      const contentItem = contentItems && contentItems.item(index);
      if (tabItem === itemElement) {
        foundTarget = true;
        itemElement.setAttribute('mdw-selected', '');
        if (tabContentElement) {
          tabContentElement.setAttribute('mdw-selected-index', index.toString());
        }
        if (contentItem) {
          contentItem.setAttribute('mdw-selected', '');
        }
      } else {
        if (tabItem.hasAttribute('mdw-selected')) {
          foundPreviousSelection = true;
          tabItem.removeAttribute('mdw-selected');
        }
        if (contentItem && contentItem.hasAttribute('mdw-selected')) {
          contentItem.removeAttribute('mdw-selected');
        }
      }

      if (!foundTarget) {
        left += tabItem.clientWidth;
      }
      if (foundTarget && foundPreviousSelection) {
        break;
      }
    }

    if (tabContentElement) {
      tabContentElement.scrollLeft = 0;
      nextTick(() => {
        tabContentElement.scrollLeft = 0;
      });
    }

    /** @type {HTMLElement} */
    const indicatorElement = (tabItemsElement.getElementsByClassName('mdw-tab__indicator')[0]);
    // Animate selection
    // Only use explicity positioning on scrollable tabs
    if (!tabItemsElement.hasAttribute('mdw-scrollable') || !tabItemsElement.clientWidth) {
      // use CSS styling fallback
      indicatorElement.style.removeProperty('left');
      indicatorElement.style.removeProperty('right');
      indicatorElement.style.removeProperty('width');
      indicatorElement.style.removeProperty('transform');
      indicatorElement.removeAttribute('mdw-js-indicator');
      // this.onItemSelected(itemElement);
      return;
    }
    const width = itemElement.clientWidth;
    const right = tabItemsElement.scrollWidth - left - itemElement.clientWidth;
    if (!indicatorElement.hasAttribute('mdw-js-indicator')) {
      indicatorElement.setAttribute('mdw-js-indicator', '');
    }

    indicatorElement.style.setProperty('left', `${left}px`);
    indicatorElement.style.setProperty('right', `${right}px`);
    indicatorElement.style.setProperty('width', `${width}px`);
    indicatorElement.style.setProperty('transform', 'none');
  }
}

export {
  Tab,
  TabItem,
};
