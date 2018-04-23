import * as cookies from './cookies';
import { setRTLMode, setDarkMode, setFontSize } from './menuoptions';

const useRTLMode = cookies.getItem('rtlmode') === 'true';
setRTLMode(useRTLMode);

const useDarkMode = cookies.getItem('darkmode') === 'true';
setDarkMode(useDarkMode);

const fontsize = cookies.getItem('fontsize');
setFontSize(fontsize);
