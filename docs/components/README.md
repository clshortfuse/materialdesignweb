# Component Library Overview

MDW is components-first. Build interfaces with custom elements and layout
attributes — no custom CSS required for common layouts.

## 1) Quick start (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Get started</mdw-button>
```

CDN theming params are documented in [Theming](../theming/README.md).

## 2) Install (ESM)

```bash
npm install @shortfuse/materialdesignweb
```

Full bundle:

```js
import '@shortfuse/materialdesignweb';
```

Single component:

```js
import Button from '@shortfuse/materialdesignweb/components/Button.js';
```

## 3) Use components in HTML

```html
<mdw-card outlined>
  <mdw-title>Title</mdw-title>
  <mdw-divider></mdw-divider>
  <mdw-body>Body</mdw-body>
  <mdw-button>Action</mdw-button>
</mdw-card>
```

## 4) Component categories

All components follow Material Design 3. Size is shown for quick comparison.*

### Layout & structure (details: [layout.md](layout.md))

| Component | Demo | Spec | Size |
| :-- | :-: | :-: | --: |
| [Root](../../components/Root.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Root.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Page](../../components/Page.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Page.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Pane](../../components/Pane.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Pane.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Box](../../components/Box.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Box.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Grid](../../components/Grid.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root-sample.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Grid.js?compression=gzip&softmax=2048&max=4096&label=) |

### Typography (details: [typography.md](typography.md))

| Component | Demo | Spec | Size |
| :-- | :-: | :-: | --: |
| [Display](../../components/Display.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/typography.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Display.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Headline](../../components/Headline.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/typography.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Headline.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Title](../../components/Title.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/typography.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Title.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Body](../../components/Body.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/typography.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Body.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Label](../../components/Label.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/typography.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Label.js?compression=gzip&softmax=2048&max=4096&label=) |

### Controls & inputs (details: [controls.md](controls.md))

| Component | Demo | Spec | Size |
| :-- | :-: | :-: | --: |
| [Button](../../components/Button.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/buttons.html) | [Spec](https://m3.material.io/components/buttons) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Button.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Icon Button](../../components/IconButton.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/buttons.html) | [Spec](https://m3.material.io/components/icon-buttons) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/IconButton.js?compression=gzip&softmax=2048&max=4096&label=) |
| [FAB](../../components/Fab.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/buttons.html) | [Spec](https://m3.material.io/components/floating-action-button) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Fab.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Segmented Button](../../components/SegmentedButton.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/buttons.html) | [Spec](https://m3.material.io/components/segmented-buttons) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/SegmentedButton.js?compression=gzip&softmax=2048&max=4096&label=) |
| [SegmentedButtonGroup](../../components/SegmentedButtonGroup.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/buttons.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/SegmentedButtonGroup.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Checkbox](../../components/Checkbox.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/checkbox.html) | [Spec](https://m3.material.io/components/checkbox) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Checkbox.js?compression=gzip&softmax=2048&max=4096&label=) |
| [CheckboxIcon](../../components/CheckboxIcon.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/CheckboxIcon.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Radio](../../components/Radio.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/radio.html) | [Spec](https://m3.material.io/components/radio-button) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Radio.js?compression=gzip&softmax=2048&max=4096&label=) |
| [RadioIcon](../../components/RadioIcon.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/RadioIcon.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Switch](../../components/Switch.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/switches.html) | [Spec](https://m3.material.io/components/switch) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Switch.js?compression=gzip&softmax=2048&max=4096&label=) |
| [SwitchIcon](../../components/SwitchIcon.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/SwitchIcon.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Slider](../../components/Slider.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/sliders.html) | [Spec](https://m3.material.io/components/sliders) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Slider.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Text Input](../../components/Input.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/textinput.html) | [Spec](https://m3.material.io/components/text-fields) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Input.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Select](../../components/Select.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/select.html) | [Spec](https://m3.material.io/components/menus) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Select.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Text Area](../../components/TextArea.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/textarea.html) | [Spec](https://m3.material.io/components/text-fields) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/TextArea.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Chip](../../components/Chip.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/chips.html) | [Spec](https://m3.material.io/components/chips) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Chip.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Filter Chip](../../components/FilterChip.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/chips.html) | [Spec](https://m3.material.io/components/chips) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/FilterChip.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Input Chip](../../components/InputChip.js) | - | [Spec](https://m3.material.io/components/chips) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/InputChip.js?compression=gzip&softmax=2048&max=4096&label=) |
| [FabContainer](../../components/FabContainer.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root-sample.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/FabContainer.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Icon](../../components/Icon.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/icon.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Icon.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Ripple](../../components/Ripple.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Ripple.js?compression=gzip&softmax=2048&max=4096&label=) |

### Navigation & lists (details: [navigation.md](navigation.md))

| Component | Demo | Spec | Size |
| :-- | :-: | :-: | --: |
| [Top App Bar](../../components/TopAppBar.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/topappbar.html) | [Spec](https://m3.material.io/components/top-app-bar) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/TopAppBar.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Bottom App Bar](../../components/BottomAppBar.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/bottomappbar.html) | [Spec](https://m3.material.io/components/bottom-app-bar) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/BottomAppBar.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Nav Bar](../../components/NavBar.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/navbar.html) | [Spec](https://m3.material.io/components/navigation-bar) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavBar.js?compression=gzip&softmax=2048&max=4096&label=) |
| [NavBarItem](../../components/NavBarItem.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/navbar.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavBarItem.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Nav Drawer](../../components/NavDrawer.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/navdrawer.html) | [Spec](https://m3.material.io/components/navigation-drawer) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavDrawer.js?compression=gzip&softmax=2048&max=4096&label=) |
| [NavDrawerItem](../../components/NavDrawerItem.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/navdrawer.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavDrawerItem.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Nav Rail](../../components/NavRail.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/navrail.html) | [Spec](https://m3.material.io/components/navigation-rail) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavRail.js?compression=gzip&softmax=2048&max=4096&label=) |
| [NavRailItem](../../components/NavRailItem.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/navrail.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavRailItem.js?compression=gzip&softmax=2048&max=4096&label=) |
| [NavItem](../../components/NavItem.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/NavItem.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Tab](../../components/Tab.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/tabs.html) | [Spec](https://m3.material.io/components/tabs) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Tab.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Tab List](../../components/TabList.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/tabs.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/TabList.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Tab Panel](../../components/TabPanel.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/tabs.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/TabPanel.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Tab Content](../../components/TabContent.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/tabs.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/TabContent.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Menu](../../components/Menu.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/menus.html) | [Spec](https://m3.material.io/components/menus) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Menu.js?compression=gzip&softmax=2048&max=4096&label=) |
| [MenuItem](../../components/MenuItem.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/menus.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/MenuItem.js?compression=gzip&softmax=2048&max=4096&label=) |
| [List](../../components/List.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/list.html) | [Spec](https://m3.material.io/components/lists) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/List.js?compression=gzip&softmax=2048&max=4096&label=) |
| [ListItem](../../components/ListItem.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/list.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/ListItem.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Listbox](../../components/Listbox.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/listbox.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Listbox.js?compression=gzip&softmax=2048&max=4096&label=) |
| [ListOption](../../components/ListOption.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/listbox.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/ListOption.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Search](../../components/Search.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/search.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Search.js?compression=gzip&softmax=2048&max=4096&label=) |

### Feedback & overlays (details: [feedback.md](feedback.md))

| Component | Demo | Spec | Size |
| :-- | :-: | :-: | --: |
| [Dialog](../../components/Dialog.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/dialogs.html) | [Spec](https://m3.material.io/components/dialogs) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Dialog.js?compression=gzip&softmax=2048&max=4096&label=) |
| [DialogActions](../../components/DialogActions.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/DialogActions.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Snackbar](../../components/Snackbar.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/snackbar.html) | [Spec](https://m3.material.io/components/snackbar) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Snackbar.js?compression=gzip&softmax=2048&max=4096&label=) |
| [SnackbarContainer](../../components/SnackbarContainer.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/root-sample.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/SnackbarContainer.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Progress](../../components/Progress.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/progress.html) | [Spec](https://m3.material.io/components/progress-indicators) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Progress.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Tooltip](../../components/Tooltip.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/tooltip.html) | [Spec](https://m3.material.io/components/tooltips) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Tooltip.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Badge](../../components/Badge.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/badge.html) | [Spec](https://m3.material.io/components/badges) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Badge.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Bottom Sheet](../../components/BottomSheet.js) | - | [Spec](https://m3.material.io/components/bottom-sheets) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/BottomSheet.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Side Sheet](../../components/SideSheet.js) | - | [Spec](https://m3.material.io/components/side-sheets) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/SideSheet.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Popup](../../components/Popup.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Popup.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Scrim](../../components/Scrim.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Scrim.js?compression=gzip&softmax=2048&max=4096&label=) |

### Content & surfaces (details: [content.md](content.md))

| Component | Demo | Spec | Size |
| :-- | :-: | :-: | --: |
| [Surface](../../components/Surface.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/color.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Surface.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Card](../../components/Card.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/cards.html) | [Spec](https://m3.material.io/components/cards) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Card.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Divider](../../components/Divider.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/dividers.html) | [Spec](https://m3.material.io/components/divider) | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Divider.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Shape](../../components/Shape.js) | [Demo](https://clshortfuse.github.io/materialdesignweb/components/shape.html) | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Shape.js?compression=gzip&softmax=2048&max=4096&label=) |
| [Table](../../components/Table.js) | - | - | ![](https://img.badgesize.io/clshortfuse/materialdesignweb/main/components/Table.js?compression=gzip&softmax=2048&max=4096&label=) |

*Size badge is not minified; use it for relative comparison only.
