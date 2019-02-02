import { Ripple } from '../ripple/index';
import {
  findElementParentByClassName,
  isRtl,
  iterateArrayLike,
  nextTick,
  scrollToElement,
} from '../common/dom';

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

    tabItemsElement.setAttribute('mdw-js', '');
    let indicatorElement = tabItemsElement.getElementsByClassName('mdw-tab__indicator')[0];
    if (!indicatorElement) {
      indicatorElement = document.createElement('div');
      indicatorElement.classList.add('mdw-tab__indicator');
      tabItemsElement.appendChild(indicatorElement);
    }

    const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
    if (tabContentElement) {
      tabContentElement.addEventListener('scroll', Tab.onTabContentScroll);
      tabContentElement.setAttribute('mdw-js', '');
    }

    /** @type {HTMLCollectionOf<HTMLInputElement>} */
    const inputs = (tabElement.getElementsByClassName('mdw-tab__input'));
    const items = tabElement.getElementsByClassName('mdw-tab__item');

    let foundChecked = false;
    iterateArrayLike(inputs, (inputElement) => {
      if (inputElement.checked) {
        foundChecked = true;
        Tab.onInputChanged({ currentTarget: inputElement });
      }
      inputElement.addEventListener('change', Tab.onInputChanged);
    });
    if (!foundChecked && inputs.length) {
      inputs[0].checked = true;
      Tab.onInputChanged({ currentTarget: inputs[0] });
    }

    let selectedItem;
    iterateArrayLike(items, (itemElement) => {
      TabItem.attach(itemElement);
      if (itemElement.hasAttribute('mdw-selected')) {
        selectedItem = itemElement;
      }
      itemElement.addEventListener('click', Tab.onItemClicked);
    });
    if (!selectedItem && items.length) {
      selectedItem = items[0];
    }
    if (selectedItem) {
      Tab.selectItem(selectedItem);
      Tab.resetIndicatorPosition(tabElement, selectedItem);
    }
  }

  /**
   * @param {Element} tabElement
   * @return {void}
   */
  static detach(tabElement) {
    const tabItemsElement = tabElement.getElementsByClassName('mdw-tab__items')[0];
    /** @type {HTMLElement} */
    const indicatorElement = (tabItemsElement.getElementsByClassName('mdw-tab__indicator')[0]);
    const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];

    tabItemsElement.removeAttribute('mdw-js');

    iterateArrayLike(tabElement.getElementsByClassName('mdw-tab__input'), (inputElement) => {
      inputElement.removeEventListener('change', Tab.onInputChanged);
    });

    iterateArrayLike(tabItemsElement.getElementsByClassName('mdw-tab__item'), (itemElement) => {
      TabItem.detach(itemElement);
      itemElement.removeEventListener('click', Tab.onItemClicked);
      itemElement.removeAttribute('mdw-selected');
    });

    indicatorElement.style.removeProperty('transform');

    if (!tabContentElement) {
      return;
    }
    tabContentElement.removeAttribute('mdw-selected-index');
    tabContentElement.removeAttribute('mdw-js');
    tabContentElement.removeEventListener('scroll', Tab.onTabContentScroll);
    iterateArrayLike(tabContentElement.getElementsByClassName('mdw-tab__content-item'), (item) => {
      item.removeAttribute('mdw-selected');
    });
  }

  static onResize(tabElement = document.getElementsByClassName('mdw-tab')[0]) {
    let stage = 0;
    tabElement.setAttribute('mdw-resize-stage', stage.toString());
    /** @return {void} */
    function performResize() {
      if (!tabElement.hasAttribute('mdw-resize-stage')) {
        // Skip resize
        return;
      }
      const attrStage = tabElement.getAttribute('mdw-resize-stage');
      if (attrStage !== stage.toString()) {
        // Off-sync due to another resize event
        return;
      }
      stage += 1;
      tabElement.setAttribute('mdw-resize-stage', stage.toString());
      if (stage === 2) {
        const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
        if (tabContentElement && tabContentElement.hasAttribute('mdw-scrollsnap')) {
          /** @type {HTMLElement} */
          const relatedContentItem = (tabContentElement.querySelector('.mdw-tab__content-item[mdw-selected]'));
          scrollToElement(relatedContentItem, false);
        }
      } else if (stage === 4) {
        Tab.resetIndicatorPosition(tabElement);
      } else if (stage === 6) {
        tabElement.removeAttribute('mdw-resize-stage');
        return;
      }
      nextTick(performResize);
    }
    nextTick(performResize);
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onTabContentScroll(event) {
    /** @type {HTMLElement} */
    const tabContentElement = (event.currentTarget);
    if (!tabContentElement.hasAttribute('mdw-scrollsnap')) {
      event.preventDefault();
      event.stopPropagation();
      tabContentElement.scrollLeft = 0;
      nextTick(() => {
        tabContentElement.scrollLeft = 0;
      });
      return;
    }
    const tabElement = findElementParentByClassName(tabContentElement, 'mdw-tab');
    if (!tabElement) {
      return;
    }
    if (tabElement.hasAttribute('mdw-resize-stage')) {
      return;
    }
    const newTabItemElement = Tab.resetIndicatorPosition(tabElement);
    if (!newTabItemElement) {
      return;
    }
    if (newTabItemElement instanceof HTMLLabelElement) {
      const inputElement = document.getElementById(newTabItemElement.getAttribute('for'));
      if (inputElement && inputElement instanceof HTMLInputElement) {
        inputElement.checked = true;
      }
    }
    Tab.selectItem(newTabItemElement, false);
  }

  static resetIndicatorPosition(tabElement, selectedItem) {
    const tabItemsElement = tabElement.getElementsByClassName('mdw-tab__items')[0];
    const tabItems = tabItemsElement.getElementsByClassName('mdw-tab__item');
    const indicatorElement = tabItemsElement.getElementsByClassName('mdw-tab__indicator')[0];

    const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
    let newTabItemElement = null;
    let left = 0;
    let width = 0;
    if (tabContentElement && tabContentElement.hasAttribute('mdw-scrollsnap')) {
      const scrollPoint = tabContentElement.scrollLeft / tabContentElement.clientWidth;
      const leftItemIndex = Math.floor(scrollPoint);
      const visibilityPercentage = scrollPoint - leftItemIndex;
      const leftItem = tabItems.item(leftItemIndex);
      const rightItem = tabItems.item(leftItemIndex + 1);
      left = leftItem.offsetLeft;
      let right = left + leftItem.offsetWidth;
      if (rightItem && visibilityPercentage > 0) {
        left += (visibilityPercentage * leftItem.offsetWidth);
        right = rightItem.offsetLeft + (visibilityPercentage * rightItem.offsetWidth);
      }
      width = right - left;
      if (visibilityPercentage < 0.5 && !leftItem.hasAttribute('mdw-selected')) {
        newTabItemElement = leftItem;
      } else if (rightItem && visibilityPercentage >= 0.5 && !rightItem.hasAttribute('mdw-selected')) {
        newTabItemElement = rightItem;
      }
    } else if (selectedItem) {
      left = selectedItem.offsetLeft;
      width = selectedItem.offsetWidth;
    } else {
      const item = tabItemsElement.querySelector('.mdw-tab__item[mdw-selected]');
      if (item) {
        left = item.offsetLeft;
        width = item.offsetWidth;
      }
    }
    indicatorElement.style.setProperty('transform', `translateX(${left}px) scaleX(${width / 1000})`);
    return newTabItemElement;
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
   * @param {boolean} [scrollToContent=true]
   * @param {boolean} [smoothScroll=true]
   * @return {void}
   */
  static selectItem(itemElement, scrollToContent, smoothScroll) {
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
    let contentItems = null;
    let relatedContentItem = null;
    if (tabContentElement) {
      contentItems = tabContentElement.getElementsByClassName('mdw-tab__content-item');
    }
    const isRtlValue = isRtl();

    let foundPreviousSelection = false;
    let foundTarget = false;
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
          relatedContentItem = contentItem;
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
      if (foundTarget && foundPreviousSelection) {
        break;
      }
    }

    if (tabContentElement) {
      if (tabContentElement.hasAttribute('mdw-scrollsnap')) {
        if ((scrollToContent !== false) && relatedContentItem) {
          scrollToElement(relatedContentItem, smoothScroll !== false);
        }
      } else {
        tabContentElement.scrollLeft = 0;
        nextTick(() => {
          tabContentElement.scrollLeft = 0;
        });
        Tab.resetIndicatorPosition(tabElement, itemElement);
      }
    }

    if (tabItemsElement && tabItemsElement.hasAttribute('mdw-scrollable')) {
      scrollToElement(itemElement, smoothScroll !== false);
    }
  }
}

export {
  Tab,
  TabItem,
};
