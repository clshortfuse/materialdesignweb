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

# Core modules

| Module                          |    Extends     | Implements | Description                                                                | Status |
| :------------------------------ | :------------: | :--------: | :------------------------------------------------------------------------- | :----: |
| [MDWComponent](core/component/) | `HTMLElement`  |  `<span>`  | Handles ShadowDOM, styles, fragments, ElementInternals, and IDL attributes |  beta  |
| [MDWText](core/text/)           | `MDWComponent` |  `<span>`  | Applies typography and ink (foreground) colors                             |  beta  |
| [MDWContainer](core/container/) |   `MDWText`    |  `<div>`   | Applies shapes, shadows, and background colors                             |  beta  |
| [MDWOverlay](core/overlay/)     | `MDWContainer` |  `<div>`   | Adds hover, focus, pressed, dragged, and disabled states                   |  beta  |
| [MDWRipple](core/ripple/)       |  `MDWOverlay`  |  `<div>`   | Substitutes pressed state for ripple effect                                | alpha  |
| [MDWIcon](core/icon/)           | `MDWContainer` | `<image>`  | Adds font and image icons                                                  | alpha  |
| [MDWInput](core/input/)         |  `MDWRipple`   | `<input>`  | Wraps `<input>` element and adds form support                              |  beta  |
| [MDWTheme](core/theme/)         |     *N/A*      |   *N/A*    | Adds color, shape and typography rules                                     | alpha  |


# M3 Components

| Component                                                 | HTML                                        |     Extends      | ARIA Role  | Implements                                   | Status  |
| :-------------------------------------------------------- | :------------------------------------------ | :--------------: | :--------: | :------------------------------------------- | :-----: |
| [Button: Elevated](components/button)                     | `<mdw-button elevated>`                     |    `MDWInput`    |  `button`  | `<input type=button>`                        |  beta   |
| [Button: Filled](components/button)                       | `<mdw-button filled>`                       |    `MDWInput`    |  `button`  | `<input type=button>`                        |  beta   |
| [Button: Filled Tonal](components/button)                 | `<mdw-button filled=tonal>`                 |    `MDWInput`    |  `button`  | `<input type=button>`                        |  beta   |
| [Button: Outlined](components/button)                     | `<mdw-button outlined>`                     |    `MDWInput`    |  `button`  | `<input type=button>`                        |  beta   |
| [Button: Text](components/button)                         | `<mdw-button>`                              |    `MDWInput`    |  `button`  | `<input type=button>`                        |  beta   |
| [FAB](components/fab)                                     | `<mdw-fab>`                                 | `MDWExtendedFab` |  `button`  | `<input type=button>`                        |  beta   |
| [FAB: Extended](components/fab)                           | `<mdw-extended-fab>`                        |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Icon Button: Filled](components/iconbutton)              | `<mdw-icon-button filled>`                  |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Icon Button: Filled Toggle](components/iconbutton)       | `<mdw-icon-button filled toggle>`           |   `MDWButton`    |  `button`  | `<input type=checkbox>`                      |  beta   |
| [Icon Button: Filled Tonal](components/iconbutton)        | `<mdw-icon-button filled=tonal>`            |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Icon Button: Filled Tonal Toggle](components/iconbutton) | `<mdw-icon-button filled=tonal toggle>`     |   `MDWButton`    |  `button`  | `<input type=checkbox>`                      |  beta   |
| [Icon Button: Outlined](components/iconbutton/)           | `<mdw-icon-button outlined>`                |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Icon Button: Outlined Toggle](components/iconbutton/)    | `<mdw-icon-button outlined toggle>`         |   `MDWButton`    |  `button`  | `<input type=checkbox>`                      |  beta   |
| [Icon Button: Standard](components/iconbutton/)           | `<mdw-icon-button>`                         |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Icon Button: Standard Toggle](components/iconbutton/)    | `<mdw-icon-button toggle>`                  |   `MDWButton`    |  `button`  | `<input type=checkbox>`                      |  beta   |
| [Segmented Button](components/segmentedbutton/)           | `<mdw-segmented-button>`                    |   `MDWButton`    |  `option`  | `<input type=checkbox>` `<input type=radio>` |  beta   |
| [Segmented Button Group](components/segmentedbutton/)     | `<mdw-segmented-button-group>`              |  `MDWContainer`  | `listbox`  | `<menu>`                                     |  beta   |
| [Bottom App Bar](components/bottomappbar/)                | `<mdw-bottom-app-bar>`                      |  `MDWContainer`  | `toolbar`  | `<menu>`                                     |  beta   |
| Bottom Sheet                                              |                                             |                  |            |                                              | planned |
| [Card: Elevated](components/card/)                        | `<mdw-card elevated>`                       |  `MDWContainer`  |  `figure`  | `<figure>`                                   |  beta   |
| [Card: Filled](components/card/)                          | `<mdw-card filled>`                         |  `MDWContainer`  |  `figure`  | `<figure>`                                   |  beta   |
| [Card: Outlined](components/card/)                        | `<mdw-card outlined>`                       |  `MDWContainer`  |  `figure`  | `<figure>`                                   |  beta   |
| [Card Action Area](components/card/)                      | `<mdw-card-action-area>`                    |  `MDWContainer`  |   `none`   | `<figure>`                                   |  beta   |
| [Chip: Assist](components/chip/)                          | `<mdw-chip>`                                |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Chip: Filter](components/chip/)                          | `<mdw-filter-chip>`                         |    `MDWChip`     | `checkbox` | `<input type=checkbox>`                      |  beta   |
| [Chip: Filter List](components/chip/)                     | `<mdw-filter-chip list>`                    |    `MDWChip`     | `listbox`  | `<input type=text list=slot>`                |  alpha  |
| [Chip: Input](components/chip/)                           | `<mdw-input-chip>`                          |                  |            |                                              | planned |
| [Chip: Suggestion](components/chip/)                      | `<mdw-chip suggestion>`                     |   `MDWButton`    |  `button`  | `<input type=button>`                        |  beta   |
| [Dialog: Basic](components/dialog/)                       | `<mdw-dialog title=title description=desc>` |  `MDWComponent`  |  `dialog`  | `<dialog>`                                   |  alpha  |
| [Dialog: Full-screen](components/dialog/)                 |                                             |                  |  `dialog`  | `<dialog>`                                   | planned |
| [Divider](components/divider/)                            | `<mdw-divider>`                             |  `MDWContainer`  |   `none`   | `<div>`                                      |  beta   |
| Menu                                                      |                                             |                  |            |                                              | rewrite |
| Navigation Bar                                            |                                             |                  |            |                                              | rewrite |
| Navigation Drawer                                         |                                             |                  |            |                                              | rewrite |
| Navigation Rail                                           |                                             |                  |            |                                              | planned |
| Progress Indicator: Linear                                |                                             |                  |            |                                              | planned |
| Progress Indicator: Circle                                |                                             |                  |            |                                              | rewrite |
| Radio Button                                              |                                             |                  |            |                                              | rewrite |
| Slider: Continuous                                        |                                             |                  |            |                                              | rewrite |
| Slider: Discrete                                          |                                             |                  |            |                                              | planned |
| Switch                                                    |                                             |                  |            |                                              | rewrite |
| Text fields: Filled                                       |                                             |                  |            |                                              | rewrite |
| Text fields: Outlined                                     |                                             |                  |            |                                              | rewrite |
| Top App Bar                                               |                                             |                  |            |                                              | rewrite |

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
