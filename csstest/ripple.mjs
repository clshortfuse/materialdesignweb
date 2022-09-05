import MDWButton from '../components/button/MDWButton.js';
import MDWIconButton from '../components/button/MDWIconButton.js';
import MDWContainer from '../core/container/MDWContainer.js';
import MDWOverlay from '../core/overlay/MDWOverlay.js';
import * as theming from '../core/theme/index.js';

console.log('running JS');

MDWIconButton.register();
MDWButton.register();
MDWOverlay.register();
MDWContainer.register();
theming.setupTheme();

console.log('started');
