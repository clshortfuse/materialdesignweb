import {
  setRTLMode,
  setDarkMode,
  setFontSize,
  setupMenuOptions,
} from './menuoptions';
import { getStorageItem } from './storage';


const useRTLMode = getStorageItem('rtlmode') === 'true';
const useDarkMode = getStorageItem('darkmode') === 'true';
const fontsize = getStorageItem('fontsize');

/** @return {boolean} */
function checkIsStandaloneIOS() {
  if (!navigator.standalone) {
    return false;
  }
  const ua = navigator.userAgent.toLowerCase();
  const isIPhone = /iphone/.test(ua);
  const isIPad = /ipad/.test(ua);
  return (isIPhone || isIPad);
}

/** @return {void} */
function onDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
  setupMenuOptions();
}

setRTLMode(useRTLMode);
setDarkMode(useDarkMode);
setFontSize(fontsize);

if (checkIsStandaloneIOS()) {
  document.documentElement.setAttribute('mdw-ios', '');
  document.documentElement.setAttribute('mdw-standalone', '');
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
