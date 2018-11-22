/**
 * @param {string} key
 * @return {string}
 */
export function getStorageItem(key) {
  if (!window.localStorage) {
    return null;
  }
  return localStorage.getItem(key);
}

/**
 * @param {string} key
 * @param {string} value
 * @return {void}
 */
export function setStorageItem(key, value) {
  if (!window.localStorage) {
    return;
  }
  localStorage.setItem(key, value);
}

/**
 * @param {string} key
 * @return {void}
 */
export function removeStorageItem(key) {
  if (!window.localStorage) {
    return;
  }
  localStorage.removeItem(key);
}
