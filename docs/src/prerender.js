import { setRTLMode, setDarkMode, setFontSize } from './menuoptions';
import { getCookie } from './cookies';

const useRTLMode = getCookie('rtlmode') === 'true';
const useDarkMode = getCookie('darkmode') === 'true';
const fontsize = getCookie('fontsize');

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

setRTLMode(useRTLMode);
setDarkMode(useDarkMode);
setFontSize(fontsize);

if (checkIsStandaloneIOS()) {
  document.documentElement.setAttribute('mdw-ios', '');
  document.documentElement.setAttribute('mdw-standalone', '');
}
