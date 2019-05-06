import DomAdapter from '../dom/index';
import * as ListItem from '../../components/list/item';

/**
 * @template T1
 * @template T2
 * @typedef {import('../dom/index').DomAdapterCreateOptions<T1,T2>} DomAdapterCreateOptions<T1,T2>
 */

/**
 * @param {HTMLLIElement} element
 * @param {any} data
 * @return {void}
 */
function AnyListAdapterRenderer(element, data) {
  let primaryText = element.getElementsByClassName('mdw-list__text')[0];
  if (!primaryText) {
    let contentElement = element.getElementsByClassName('mdw-list__content')[0];
    if (!contentElement) {
      contentElement = document.createElement('div');
      contentElement.className = 'mdw-list__content';
      element.appendChild(contentElement);
    }
    primaryText = document.createElement('div');
    primaryText.className = 'mdw-list__text';
    contentElement.appendChild(primaryText);
    ListItem.attach(element);
  }
  let s = '';
  if (data != null) {
    if (data.toString) {
      s = data.toString();
    } else {
      s = new String(data).toString(); // eslint-disable-line no-new-wrappers
    }
  }
  if (primaryText.textContent !== s) {
    primaryText.textContent = s;
  }
}

/**
 * @template T
 * @typedef {Object} ListAdapterCreateOptions
 * @prop {HTMLElement} element
 * @prop {Array<T>} datasource
 * @prop {function(HTMLLIElement, T):void} [render={function(HTMLIElement,T):void}]
 */

/**
 * @template T
 * @extends {DomAdapter<T, HTMLLIElement>}
 * */
export default class ListAdapter extends DomAdapter {
  /** @param {ListAdapterCreateOptions<T>} options */
  constructor(options) {
    super(options);
    if (!options.render) {
      this.render = AnyListAdapterRenderer;
    }
    this.create = ListAdapter.create;
  }

  static create() {
    const element = document.createElement('li');
    element.classList.add('mdw-list__item');
    return element;
  }
}
