import DomAdapter from '../dom/index';
import * as ListItem from '../../components/list/item';

/**
 * @param {HTMLLIElement} element
 * @param {any} data
 * @return {void}
 */
function AnyListAdapterRendererFn(element, data) {
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
 * @extends {DomAdapter<T, HTMLLIElement>}
 * */
export default class ListAdapter extends DomAdapter {
  /**
   * @param {HTMLElement} element
   * @param {Array<T>} datasource
   * @param {function(HTMLLIElement, T)=} renderFn
   */
  constructor(element, datasource, renderFn) {
    super(element, datasource, renderFn, ListAdapter.create);
    this.render = renderFn || AnyListAdapterRendererFn;
  }

  static create() {
    const element = document.createElement('li');
    element.classList.add('mdw-list__item');
    return element;
  }
}
