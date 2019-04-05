export const attachCore = setupAria;
export const attach = attachCore;

/**
 * @param {Element} listItemGroup
 * @return {void}
 */
export function setupAria(listItemGroup) {
  if (!listItemGroup.hasAttribute('role')) {
    listItemGroup.setAttribute('role', 'group');
  }
}

/**
 * @param {Element} listItemGroup
 * @return {void}
 */
export function detachCore(listItemGroup) {
  // noop
}

export const detach = detachCore;
