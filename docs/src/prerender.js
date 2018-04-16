import * as cookies from './cookies';
import { setDarkMode, setFontSize } from './menuoptions';

const useDarkMode = cookies.getItem('darkmode') === 'true';
setDarkMode(useDarkMode);

const fontsize = cookies.getItem('fontsize');
setFontSize(fontsize);
