import MDWBottomAppBar from './components/bottomappbar/MDWBottomAppBar.js';
import MDWButton from './components/button/MDWButton.js';
import MDWExtendedFabButton from './components/button/MDWExtendedFabButton.js';
import MDWFabButton from './components/button/MDWFabButton.js';
import MDWIconButton from './components/button/MDWIconButton.js';
import MDWSegmentedButton from './components/button/MDWSegmentedButton.js';
import MDWSegmentedButtonGroup from './components/button/MDWSegmentedButtonGroup.js';
import MDWCard from './components/card/MDWCard.js';
import MDWCardActionArea from './components/card/MDWCardActionArea.js';
import MDWAssistChip from './components/chip/MDWChip.js';
import MDWFilterChip from './components/chip/MDWFilterChip.js';
import MDWContainer from './core/container/MDWContainer.js';
import MDWOverlay from './core/overlay/MDWOverlay.js';
import * as theming from './core/theme/index.js';

MDWBottomAppBar.register();
MDWButton.register();
MDWExtendedFabButton.register();
MDWFabButton.register();
MDWIconButton.register();
MDWSegmentedButton.register();
MDWSegmentedButtonGroup.register();
MDWCard.register();
MDWCardActionArea.register();
MDWAssistChip.register();
MDWFilterChip.register();
MDWContainer.register();
MDWOverlay.register();

const { searchParams } = new URL(import.meta.url);
const color = searchParams.get('color') || '#6750A4';

/** @type {[string,string?][]} */
const custom = searchParams.getAll('custom')
  .flatMap((c) => c.split(','))
  .map((c) => c.split(':'));

theming.setupTheme({
  color,
  custom,
  lightness: searchParams.get('lightness'),
});
