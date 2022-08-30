import MDWBottomAppBar from './components/bottomappbar/MDWBottomAppBar.js';
import MDWButton from './components/button/MDWButton.js';
import MDWCard from './components/card/MDWCard.js';
import MDWCardActionArea from './components/card/MDWCardActionArea.js';
import MDWAssistChip from './components/chip/MDWChip.js';
import MDWFilterChip from './components/chip/MDWFilterChip.js';
import MDWDialog from './components/dialog/MDWDialog.js';
import MDWDivider from './components/divider/MDWDivider.js';
import MDWExtendedFab from './components/fab/MDWExtendedFab.js';
import MDWFab from './components/fab/MDWFab.js';
import MDWIconButton from './components/iconbutton/MDWIconButton.js';
import MDWSegmentedButton from './components/segmentedbutton/MDWSegmentedButton.js';
import MDWSegmentedButtonGroup from './components/segmentedbutton/MDWSegmentedButtonGroup.js';
import MDWContainer from './core/container/MDWContainer.js';
import MDWIcon from './core/icon/MDWIcon.js';
import MDWOverlay from './core/overlay/MDWOverlay.js';
import MDWText from './core/text/MDWText.js';
import * as theming from './core/theme/index.js';

MDWText.register();
MDWContainer.register();
MDWOverlay.register();

MDWIcon.register();
MDWButton.register();
MDWFab.register();
MDWExtendedFab.register();
MDWIconButton.register();
MDWSegmentedButtonGroup.register();
MDWSegmentedButton.register();

MDWBottomAppBar.register();

MDWCard.register();
MDWCardActionArea.register();

// BottomSheets.register()

MDWAssistChip.register();
MDWFilterChip.register();

// MDWInputChip.register();

MDWDialog.register();

MDWDivider.register();

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
