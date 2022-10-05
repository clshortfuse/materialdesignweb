import BottomAppBar from './components/BottomAppBar.js';
import Button from './components/Button.js';
import Card from './components/Card.js';
import CardActionArea from './components/CardActionArea.js';
import Chip from './components/Chip.js';
import Container from './components/Container.js';
import Dialog from './components/Dialog.js';
import Divider from './components/Divider.js';
import ExtendedFab from './components/ExtendedFab.js';
import Fab from './components/Fab.js';
import FilterChip from './components/FilterChip.js';
import Icon from './components/Icon.js';
import IconButton from './components/IconButton.js';
import Menu from './components/Menu.js';
import MenuItem from './components/MenuItem.js';
import NavBar from './components/NavBar.js';
import NavDrawer from './components/NavDrawer.js';
import NavItem from './components/NavItem.js';
import NavRail from './components/NavRail.js';
import Overlay from './components/Overlay.js';
import Progress from './components/Progress.js';
import Radio from './components/Radio.js';
import SegmentedButton from './components/SegmentedButton.js';
import SegmentedButtonGroup from './components/SegmentedButtonGroup.js';
import Slider from './components/Slider.js';
import Switch from './components/Switch.js';
import Text from './components/Text.js';
import * as theming from './theming/index.js';

Text.register();
Container.register();
Overlay.register();

Icon.register();
Button.register();
Fab.register();
ExtendedFab.register();
IconButton.register();
SegmentedButtonGroup.register();
SegmentedButton.register();

BottomAppBar.register();

Card.register();
CardActionArea.register();

// BottomSheets.register()

Chip.register();
FilterChip.register();

// InputChip.register();

Dialog.register();

Divider.register();

Menu.register();
MenuItem.register();

NavItem.register();

NavBar.register();
NavRail.register();
NavDrawer.register();
Progress.register();
Radio.register();
Slider.register();
Switch.register();

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
