import 'element-internals-polyfill'; // Safari

import '../components/Badge.js';
import '../components/Body.js';
import '../components/BottomAppBar.js';
import '../components/Box.js';
import '../components/Button.js';
import '../components/Card.js';
import '../components/Checkbox.js';
import '../components/Chip.js';
import '../components/Dialog.js';
import '../components/Divider.js';
import '../components/ExtendedFab.js';
import '../components/Fab.js';
import '../components/FilterChip.js';
import '../components/Headline.js';
import '../components/Icon.js';
import '../components/IconButton.js';
import '../components/Input.js';
import '../components/Label.js';
import '../components/Layout.js';
import '../components/List.js';
import '../components/ListItem.js';
import '../components/ListOption.js';
import '../components/Listbox.js';
import '../components/Menu.js';
import '../components/MenuItem.js';
import '../components/NavBar.js';
import '../components/NavBarItem.js';
import '../components/NavDrawer.js';
import '../components/NavDrawerItem.js';
import '../components/NavItem.js';
import '../components/NavRail.js';
import '../components/NavRailItem.js';
import '../components/Pane.js';
import '../components/Progress.js';
import '../components/Radio.js';
import '../components/SegmentedButton.js';
import '../components/SegmentedButtonGroup.js';
import '../components/Select.js';
import '../components/Slider.js';
import '../components/Snackbar.js';
import '../components/Surface.js';
import '../components/Switch.js';
import '../components/Tab.js';
import '../components/TabContent.js';
import '../components/TabList.js';
import '../components/TabPanel.js';
import '../components/TextArea.js';
import '../components/Title.js';
import '../components/Tooltip.js';
import '../components/TopAppBar.js';

import './demo/DemoButton.js';
import './demo/DemoDummy.js';
import './demo/DemoScreen.js';
import './demo/DemoSection.js';

// Load last to avoid layout shifts
import './demo/DemoPage.js';

import { addIconAliases, reportUnaliasedMaterialSymbols } from './icon-aliases.js';

addIconAliases();

console.debug(JSON.stringify(await reportUnaliasedMaterialSymbols([])));
