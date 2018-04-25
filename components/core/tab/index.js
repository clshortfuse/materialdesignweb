import { Ripple } from '../ripple/index';
import { findElementParentByClassName, isRtl } from '../../common/dom';

class TabItem {
  /**
   * @param {Element} tabItemElement
   * @param {boolean=} [attachRipple=true]
   * @return {void}
   */
  static attach(tabItemElement, attachRipple) {
    if (attachRipple !== false) {
      Ripple.attach(tabItemElement);
    }
  }

  /**
   * @param {Element} tabItemElement
   * @param {boolean=} [detachRipple=true]
   * @return {void}
   */
  static detach(tabItemElement, detachRipple) {
    if (detachRipple !== false) {
      Ripple.detach(tabItemElement);
    }
  }
}

class Tab {
  /**
   * @param {Element} tabElement
   * @param {boolean=} [attachRipples=true]
   * @return {void}
   */
  static attach(tabElement, attachRipples) {
    const [tabItemsElement] = tabElement.getElementsByClassName('mdw-tab__items');
    let [indicatorElement] = tabItemsElement.getElementsByClassName('mdw-tab__indicator');
    if (!indicatorElement) {
      indicatorElement = document.createElement('div');
      indicatorElement.classList.add('mdw-tab__indicator');
      tabItemsElement.appendChild(indicatorElement);
    }

    const inputs = tabElement.getElementsByClassName('mdw-tab__input');
    const items = tabElement.getElementsByClassName('mdw-tab__item');

    for (let i = 0; i < inputs.length; i += 1) {
      const inputElement = inputs[i];
      if (inputElement.checked) {
        Tab.onInputChanged({ target: inputElement });
      }
      inputElement.addEventListener('change', Tab.onInputChanged);
    }

    for (let i = 0; i < items.length; i += 1) {
      const itemElement = items[i];
      TabItem.attach(itemElement, attachRipples);
      if (itemElement.hasAttribute('mdw-selected')) {
        Tab.selectItem(itemElement);
      }
      itemElement.addEventListener('click', Tab.onItemClicked);
    }
  }

  /**
   * @param {Element} tabElement
   * @param {boolean=} [detachRipples=true]
   * @return {void}
   */
  static detach(tabElement, detachRipples) {
    const inputs = tabElement.getElementsByClassName('mdw-tab__input');
    const items = tabElement.getElementsByClassName('mdw-tab__item');
    for (let i = 0; i < inputs.length; i += 1) {
      const inputElement = inputs[i];
      inputElement.removeEventListener('change', Tab.onInputChanged);
    }

    for (let i = 0; i < items.length; i += 1) {
      const itemElement = items[i];
      TabItem.detach(itemElement, detachRipples);
      itemElement.removeEventListener('click', Tab.onItemClicked);
    }
  }

  static onItemClicked(event) {
    const itemElement = findElementParentByClassName(event.target, 'mdw-tab__item');
    if (!itemElement) {
      return;
    }
    Tab.selectItem(itemElement);
    const tabItemsElement = findElementParentByClassName(event.target, 'mdw-tab__items', false);
    if (tabItemsElement && tabItemsElement.hasAttribute('mdw-scrollable')) {
      itemElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  static onInputChanged(event) {
    const inputElement = event.target;
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
    const [tabContentElement] = tabElement.getElementsByClassName('mdw-tab__content');
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

    const [indicatorElement] = tabItemsElement.getElementsByClassName('mdw-tab__indicator');
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
