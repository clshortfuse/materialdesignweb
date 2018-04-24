import * as cookies from './cookies';
import { setRTLMode, setDarkMode, setFontSize } from './menuoptions';

const useRTLMode = cookies.getItem('rtlmode') === 'true';
const useDarkMode = cookies.getItem('darkmode') === 'true';
const fontsize = cookies.getItem('fontsize');

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
