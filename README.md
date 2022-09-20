# Note

`master` branch has been been soft-archived. All new work is being done at https://github.com/clshortfuse/materialdesignweb/tree/native

# materialdesignweb
Material Design for Web

# About

A standards-focused, zero-dependency implemention of Material Design 3 (Material You).

# Demo

https://rawcdn.githack.com/clshortfuse/materialdesignweb/native/demo.html?d=1661896564063

# Getting started

```html
<style type="module" src="https://rawcdn.githack.com/clshortfuse/materialdesignweb/native/index.js?d=1661896564063" />
```

# Support

* Unbundled: Chrome >=93
* Bundled: >1% browsers *(polyfills not included)*

# Core components

| Module                                       |     Extends     | Implements | Description                                                                | Status |
| :------------------------------------------- | :-------------: | :--------: | :------------------------------------------------------------------------- | :----: |
| [CustomElement](components/CustomElement.md) |  `HTMLElement`  |  `<span>`  | Handles ShadowDOM, styles, fragments, ElementInternals, and IDL attributes |  beta  |
| [Text](components/Text.md)                   | `CustomElement` |  `<span>`  | Applies typography and ink (foreground) colors                             |  beta  |
| [Container](components/Container.md)         |     `Text`      |  `<div>`   | Applies shapes, shadows, and background colors                             |  beta  |
| [Icon](components/Icon.md)                   |   `Container`   | `<image>`  | Adds font and image icons                                                  | alpha  |
| [Overlay](components/Overlay.md)             |   `Container`   |  `<div>`   | Adds hover, focus, pressed, dragged, and disabled states                   |  beta  |
| [Ripple](components/Ripple.md/)              |    `Overlay`    |  `<div>`   | Substitutes pressed state for ripple effect                                | alpha  |
| [Input](components/Input.md)                 |    `Ripple`     | `<input>`  | Wraps `<input>` element and adds form support                              |  beta  |
| [Theme](theming/index.js)                    |      *N/A*      |   *N/A*    | Adds color, shape and typography rules                                     | alpha  |


# M3 Components

| Component                                                    | HTML                                           | Implements                                                         | Status  |
| :----------------------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------- | :-----: |
| [Button: Elevated](components/Button.md)                     | `<mdw-button elevated>`                        | `<input type=button>`                                              |  beta   |
| [Button: Filled](components/Button.md)                       | `<mdw-button filled>`                          | `<input type=button>`                                              |  beta   |
| [Button: Filled Tonal](components/Button.md)                 | `<mdw-button filled=tonal>`                    | `<input type=button>`                                              |  beta   |
| [Button: Outlined](components/Button.md)                     | `<mdw-button outlined>`                        | `<input type=button>`                                              |  beta   |
| [Button: Text](components/Button.md)                         | `<mdw-button>`                                 | `<input type=button>`                                              |  beta   |
| [FAB](components/Fab.md)                                     | `<mdw-fab>`                                    | `<input type=button>`                                              |  beta   |
| [FAB: Extended](components/Fab.md)                           | `<mdw-extended-fab>`                           | `<input type=button>`                                              |  beta   |
| [Icon Button: Filled](components/IconButton.md)              | `<mdw-icon-button filled>`                     | `<input type=button>`                                              |  beta   |
| [Icon Button: Filled Toggle](components/IconButton.md)       | `<mdw-icon-button filled type=checkbox>`       | `<input type=checkbox>`                                            |  beta   |
| [Icon Button: Filled Tonal](components/IconButton.md)        | `<mdw-icon-button filled=tonal>`               | `<input type=button>`                                              |  beta   |
| [Icon Button: Filled Tonal Toggle](components/Iconbutton.md) | `<mdw-icon-button filled=tonal type=checkbox>` | `<input type=checkbox>`                                            |  beta   |
| [Icon Button: Outlined](components/IconButton.md)            | `<mdw-icon-button outlined>`                   | `<input type=button>`                                              |  beta   |
| [Icon Button: Outlined Toggle](components/IconButton.md)     | `<mdw-icon-button outlined type=checkbox>`     | `<input type=checkbox>`                                            |  beta   |
| [Icon Button: Standard](components/IconButton.md)            | `<mdw-icon-button>`                            | `<input type=button>`                                              |  beta   |
| [Icon Button: Standard Toggle](components/IconButton.md)     | `<mdw-icon-button type=checkbox>`              | `<input type=checkbox>`                                            |  beta   |
| [Segmented Button](components/SegmentedButton.md)            | `<mdw-segmented-button>`                       | `<input type=checkbox>` `<input type=radio>`                       |  beta   |
| [Segmented Button Group](components/SegmentedButton.md)      | `<mdw-segmented-button-group>`                 | `<menu>`                                                           |  beta   |
| [Bottom App Bar](components/BottomAppBar.md)                 | `<mdw-bottom-app-bar>`                         | `<menu>`                                                           |  beta   |
| Bottom Sheet                                                 |                                                |                                                                    | planned |
| [Card: Elevated](components/Card.md)                         | `<mdw-card elevated>`                          | `<figure>`                                                         |  beta   |
| [Card: Filled](components/Card.md)                           | `<mdw-card filled>`                            | `<figure>`                                                         |  beta   |
| [Card: Outlined](components/Card.md)                         | `<mdw-card outlined>`                          | `<figure>`                                                         |  beta   |
| [Card Action Area](components/Card.md)                       | `<mdw-card-action-area>`                       | `<figure>`                                                         |  beta   |
| [Chip: Assist](components/Chip.md)                           | `<mdw-chip>`                                   | `<input type=button>`                                              |  beta   |
| [Chip: Filter](components/Chip.md)                           | `<mdw-filter-chip>`                            | `<input type=checkbox>`                                            |  beta   |
| [Chip: Filter Dropdown](components/Chip.md)                  |                                                |                                                                    | planned |
| [Chip: Input](components/Chip.md)                            | `<mdw-input-chip>`                             |                                                                    | planned |
| [Chip: Suggestion](components/Chip.md)                       | `<mdw-chip suggestion>`                        | `<input type=button>`                                              |  beta   |
| [Dialog: Basic](components/Dialog.md)                        | `<mdw-dialog title=title description=desc>`    | `<dialog>`                                                         |  alpha  |
| [Dialog: Full-screen](components/Dialog.md)                  |                                                | `<dialog>`                                                         | planned |
| [Divider](components/Divider.md)                             | `<mdw-divider>`                                | `<div>`                                                            |  beta   |
| [Menu](components/Menu.md)                                   | `<mdw-menu>`                                   | `<dialog>`                                                         |  beta   |
| [Menu Item](components/MenuItem.md)                          | `<mdw-menu-item>`                              | `<input type=button>` `<input type=checkbox>` `<input type=radio>` |  beta   |
| [Nav Bar](components/NavBar.md)                              | `<mdw-nav-bar>`                                | `<nav>`                                                            |  beta   |
| [Nav Bar Item](components/NavBarItem.md)                     | `<mdw-nav-bar-item>`                           | `<a href=#>`                                                       |  beta   |
| Navigation Drawer                                            |                                                |                                                                    | rewrite |
| Navigation Rail                                              |                                                |                                                                    | planned |
| Progress Indicator: Linear                                   |                                                |                                                                    | planned |
| Progress Indicator: Circle                                   |                                                |                                                                    | rewrite |
| Radio Button                                                 |                                                |                                                                    | rewrite |
| Slider: Continuous                                           |                                                |                                                                    | rewrite |
| Slider: Discrete                                             |                                                |                                                                    | planned |
| Switch                                                       |                                                |                                                                    | rewrite |
| Text fields: Filled                                          |                                                |                                                                    | rewrite |
| Text fields: Outlined                                        |                                                |                                                                    | rewrite |
| Top App Bar                                                  |                                                |                                                                    | rewrite |

# Other Components

These components do not have official M3 guidelines

| Component    | HTML               | Extends | ARIA Role  | Implements |  Status  |
| :----------- | :----------------- | :-----: | :--------: | :--------- | :------: |
| ~~Backdrop~~ |                    |         |            |            | no plans |
| Banner       | `<mdw-banner>`     |         |            |            | rewrite  |
| Checkbox     | `<mdw-checkbox>`   |         | `checkbox` |            | rewrite  |
| Data Table   |                    |         |            |            | rewrite  |
| Data Picker  |                    |         |            |            | planned  |
| Image List   |                    |         |            |            | rewrite  |
| List         | `<mdw-list>`       |         |            |            | rewrite  |
| Snackbar     | `<mdw-snackbar>`   |         |  `alert`   |            | rewrite  |
| Side Sheet   | `<mdw-side-sheet>` |         |            |            | rewrite  |
| Tab          | `<mdw-tab>`        |         |   `tab`    |            | rewrite  |
| Time Picker  |                    |         |            |            | planned  |
| Tooltip      | `<mdw-tooltip>`    |         | `tooltip`  |            | rewrite  |

# Adapter classes
| Adapter                          | Status  |
| :------------------------------- | :------ |
| [datatable](adapters/datatable/) | rewrite |
| [dom](adapters/dom/)             | rewrite |
| [list](adapters/list/)           | rewrite |
| [search](adapters/search/)       | rewrite |

## Status Legend

* no plans - No current plans to implement
* planned - Planned for later
* rewrite - Needs to be rewritten
* draft - Not yet functional
* alpha - Partially working
* beta - Working but incomplete
* preRC - Needs minor changes
* RC - Needs testing as-is
* stable - Production-ready


* † - Required

* ‡ - Apply manually
