# Note

`master` branch has been been soft-archived. All new work is being done at https://github.com/clshortfuse/materialdesignweb/tree/native

# materialdesignweb
Material Design for Web

# About

A standards-focused, zero-dependency implemention of Material Design 3 (Material You).

# Demo

https://rawcdn.githack.com/clshortfuse/materialdesignweb/bbe1bd8/docs/

# Getting started

````html
<script type="module" src="https://rawcdn.githack.com/clshortfuse/materialdesignweb/bbe1bd8/index.js" />
````

# Support

* Unbundled: Chrome >=94
* Bundled: >1% browsers *(polyfills not included)*

# Components

| Component                                                    | HTML                                           | Implements                                                         | Status  |
| :----------------------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------- | :-----: |
| [Badge](components/Badge.js)                                 | `<mdw-badge>`                                  | `<div>`                                                            |  beta   |
| [Bottom App Bar](components/BottomAppBar.js)                 | `<mdw-bottom-app-bar>`                         | `<menu>`                                                           |  beta   |
| Bottom Sheet                                                 |                                                |                                                                    | planned |
| [Button: Elevated](components/Button.md)                     | `<mdw-button elevated>`                        | `<input type=button>`                                              |  beta   |
| [Button: Filled](components/Button.md)                       | `<mdw-button filled>`                          | `<input type=button>`                                              |  beta   |
| [Button: Filled Tonal](components/Button.md)                 | `<mdw-button filled=tonal>`                    | `<input type=button>`                                              |  beta   |
| [Button: Outlined](components/Button.md)                     | `<mdw-button outlined>`                        | `<input type=button>`                                              |  beta   |
| [Button: Text](components/Button.md)                         | `<mdw-button>`                                 | `<input type=button>`                                              |  beta   |
| [FAB](components/Fab.js)                                     | `<mdw-fab>`                                    | `<input type=button>`                                              |  beta   |
| [FAB: Extended](components/Fab.js)                           | `<mdw-extended-fab>`                           | `<input type=button>`                                              |  beta   |
| [Icon Button: Filled](components/IconButton.js)              | `<mdw-icon-button filled>`                     | `<input type=button>`                                              |  beta   |
| [Icon Button: Filled Toggle](components/IconButton.js)       | `<mdw-icon-button filled type=checkbox>`       | `<input type=checkbox>`                                            |  beta   |
| [Icon Button: Filled Tonal](components/IconButton.js)        | `<mdw-icon-button filled=tonal>`               | `<input type=button>`                                              |  beta   |
| [Icon Button: Filled Tonal Toggle](components/Iconbutton.js) | `<mdw-icon-button filled=tonal type=checkbox>` | `<input type=checkbox>`                                            |  beta   |
| [Icon Button: Outlined](components/IconButton.js)            | `<mdw-icon-button outlined>`                   | `<input type=button>`                                              |  beta   |
| [Icon Button: Outlined Toggle](components/IconButton.js)     | `<mdw-icon-button outlined type=checkbox>`     | `<input type=checkbox>`                                            |  beta   |
| [Icon Button: Standard](components/IconButton.js)            | `<mdw-icon-button>`                            | `<input type=button>`                                              |  beta   |
| [Icon Button: Standard Toggle](components/IconButton.js)     | `<mdw-icon-button type=checkbox>`              | `<input type=checkbox>`                                            |  beta   |
| [Segmented Button](components/SegmentedButton.js)            | `<mdw-segmented-button>`                       | `<input type=checkbox>` `<input type=radio>`                       |  beta   |
| [Segmented Button Group](components/SegmentedButton.js)      | `<mdw-segmented-button-group>`                 | `<menu>`                                                           |  beta   |
| [Card: Elevated](components/Card.js)                         | `<mdw-card elevated>`                          | `<figure>`                                                         |  beta   |
| [Card: Filled](components/Card.js)                           | `<mdw-card filled>`                            | `<figure>`                                                         |  beta   |
| [Card: Outlined](components/Card.js)                         | `<mdw-card outlined>`                          | `<figure>`                                                         |  beta   |
| [Card Action Area](components/CardActionArea.js)             | `<mdw-card-action-area>`                       | `<div>`                                                            |  beta   |
| [Checkbox](components/Checkbox.js)                           | `<mdw-checkbox>`                               | `<input type=checkbox>`                                            |  beta   |
| [Chip: Assist](components/Chip.js)                           | `<mdw-chip>`                                   | `<input type=button>`                                              |  beta   |
| [Chip: Filter](components/Chip.js)                           | `<mdw-filter-chip>`                            | `<input type=checkbox>`                                            |  beta   |
| [Chip: Filter Dropdown](components/Chip.js)                  |                                                |                                                                    | planned |
| [Chip: Input](components/Chip.js)                            | `<mdw-input-chip>`                             |                                                                    | planned |
| [Chip: Suggestion](components/Chip.js)                       | `<mdw-chip suggestion>`                        | `<input type=button>`                                              |  beta   |
| Date Picker                                                  |                                                |                                                                    | planned |
| [Dialog: Basic](components/Dialog.js)                        | `<mdw-dialog headline=title>`                  | `<dialog>`                                                         |  beta   |
| [Dialog: Full-screen](components/Dialog.js)                  |                                                | `<dialog>`                                                         | planned |
| [Divider](components/Divider.js)                             | `<mdw-divider>`                                | `<div>`                                                            |  beta   |
| [List](components/List.js)                                   | `<mdw-list>`                                   | `<ul>`                                                             |  beta   |
| [ListItem](components/ListItem.js)                           | `<mdw-list-item>`                              | `<li>`                                                             |  beta   |
| [ListSelect](components/ListSelect.js)                       | `<mdw-list-select>`                            | `<select>`                                                         |  beta   |
| [ListOption](components/ListOption.js)                       | `<mdw-list-option>`                            | `<option>`                                                         |  beta   |
| [Menu](components/Menu.js)                                   | `<mdw-menu>`                                   | `<dialog>`                                                         |  beta   |
| [Menu Item](components/MenuItem.js)                          | `<mdw-menu-item>`                              | `<input type=button>` `<input type=checkbox>` `<input type=radio>` |  beta   |
| [Nav Item](components/NavBarItem.js)                         | `<mdw-nav-item>`                               | `<a href=#>`                                                       |  beta   |
| [Nav Bar](components/NavBar.js)                              | `<mdw-nav-bar>`                                | `<nav>`                                                            |  alpha  |
| [Navigation Drawer](components/NavDrawer.js)                 | `<mdw-nav-drawer>`                             | `<nav>`                                                            |  alpha  |
| [Navigation Rail](components/NavRail.js)                     | `<mdw-nav-rail>`                               | `<nav>`                                                            |  beta   |
| [Progress Indicator: Linear](components/Progress.js)         | `<mdw-progress>`                               | `<progress>`                                                       |  beta   |
| [Progress Indicator: Circular](components/Progress.js)       | `<mdw-progress circle>`                        | `<progress>`                                                       |  alpha  |
| [Radio Button](components/Radio.js)                          | `<mdw-radio>`                                  | `<input type=radio>`                                               |  beta   |
| [Slider: Continuous](components/Slider.js)                   | `<mdw-slider>`                                 | `<input type=range>`                                               |  beta   |
| [Slider: Discrete](components/Slider.js)                     | `<mdw-slider ticks=10>`                        | `<input type=range>`                                               |  beta   |
| [Snackbar](components/Snackbar.js)                           | `<mdw-snackbar>`                               | `<section>`                                                        |  beta   |
| [Switch](components/Switch.js)                               | `<mdw-switch>`                                 | `<input type=checkbox>`                                            |  beta   |
| [Tab](components/Tab.js)                                     | `<mdw-tab>`                                    | `<a href=#>`                                                       |  beta   |
| [Tab List](components/TabList.js)                            | `<mdw-tab-list>`                               | `<div>`                                                            |  beta   |
| [Tab Content](components/TabContent.js)                      | `<mdw-tab-content>`                            | `<div>`                                                            |  beta   |
| [Tab Panel](components/TabPanel.js)                          | `<mdw-tab-panel>`                              | `<div>`                                                            |  beta   |
| [Text fields: Bare](components/TextInput.js)                 | `<mdw-text-input>`                             | `<input>`                                                          |  beta   |
| [Text fields: Filled](components/TextInput.js)               | `<mdw-text-input filled>`                      | `<input>`                                                          |  beta   |
| [Text fields: Filled Multiline](components/TextArea.js)      | `<mdw-textarea filled>`                        | `<textarea>`                                                       |  beta   |
| [Text fields: Filled Selection](components/TextSelect.js)    | `<mdw-text-select>`                            | `<select>`                                                         | planned |
| [Text fields: Outlined](components/TextInput.js)             | `<mdw-text-input outlined>`                    | `<input>`                                                          |  beta   |
| [Text fields: Outlined Multiline](components/TextArea.js)    | `<mdw-textarea outlined>`                      | `<textarea>`                                                       |  beta   |
| [Text fields: Outlined Selection](components/TextSelect.js)  | `<mdw-textselect outlined>`                    | `<select>`                                                         | planned |
| Time Picker                                                  |                                                |                                                                    | planned |
| [Tooltip](components/Tooltip.js)                             | `<mdw-tooltip>`                                | `<div>`                                                            |  beta   |
| [Top App Bar: Centered](components/TopAppBar.js)             | `<mdw-top-app-bar>`                            | `<menu>`                                                           |  beta   |
| [Top App Bar: Small](components/TopAppBar.js)                | `<mdw-top-app-bar size=small>`                 | `<menu>`                                                           |  beta   |
| [Top App Bar: Medium](components/TopAppBar.js)               | `<mdw-top-app-bar size=medium>`                | `<menu>`                                                           |  beta   |
| [Top App Bar: Large](components/TopAppBar.js)                | `<mdw-top-app-bar size=medium>`                | `<menu>`                                                           |  beta   |

# Custom Components

| Module                               |     Extends     | Implements | Description                                    | Status |
| :----------------------------------- | :-------------: | :--------: | :--------------------------------------------- | :----: |
| [Text](components/Text.js)           | `CustomElement` |  `<span>`  | Applies typography and ink (foreground) colors |  beta  |
| [Container](components/Container.js) |     `Text`      |  `<div>`   | Applies shapes, shadows, and background colors |  beta  |
| [Icon](components/Icon.js)           |   `Container`   | `<image>`  | Adds font and image icons                      | alpha  |

# Core

| File                                   | Description                                                                                | Status |
| :------------------------------------- | :----------------------------------------------------------------------------------------- | :----: |
| [Composition](core/Composition.js)     | Class that composes templates based on styles, fragments, and watches. Renders data        |  beta  |
| [CustomElement](core/CustomElement.js) | Extendable that handles ShadowDOM, ElementInternals, Property attributes, and compositions |  beta  |
| [css](core/css.js)                     | Module that includes css converters                                                        |  beta  |
| [dom](core/dom.js)                     | Module that include common DOM functions                                                   |  beta  |
| [indentify](core/identify.js)          | Module that includes Node identification functions                                         |  beta  |
| [observe](core/observe.js)             | Modules that applies observable pattern to object properties                               |  beta  |
| [template](core/template.js)           | Module that includes functions to generate HTML or CSS from templates                      | alpha  |

# Mixins

| Name                                                 | Description                                                                   | Status |
| :--------------------------------------------------- | :---------------------------------------------------------------------------- | :----: |
| [AriaToolbarMixin](mixins/AriaToolbarMixin.js)       | Sets ARIA `toolbar` role                                                      |  beta  |
| [ControlMixin](mixins/ControlMixin.js)               | Base mixin for Form Controls                                                  |  beta  |  |
| [FormAssociatedMixin](mixins/FormAssociatedMixin.js) | Tracks Element Internals Form Associated controls                             | alpha  |
| [InputMixin](mixins/InputMixin.js)                   | Labelled `<input>` element                                                    |  beta  |
| [KeyboardNavMixin](mixins/KeyboardNavMixin.js)       | Handles roving tab index and arrow key navigation                             |  beta  |
| [RippleMixin](mixins/RippleMixin.js)                 | Uses ripple for pressed state                                                 |  beta  |
| [ResizeObserverMixin](mixins/ResizeObserverMixin.js) | Fires callback on element resize                                              |  beta  |
| [ScrollListenerMixin](mixins/ScrollListenerMixin.js) | Tracks window or offetParent scrolling                                        |  beta  |
| [StateMixin](mixins/StateMixin.js)                   | Adds hover, focus, pressed, dragged, and disabled states, as interaction type |  beta  |
| [TextFieldMixin](mixins/TextFieldMixin.js)           | Abstraction for different controls used for text fields                       |  beta  |
| [TooltipTriggerMixin](mixins/TooltipTriggerMixin.js) | Adds focus, mouse, and touch handlers for spawning tooltips                   | alpha  |


# Other Components

These components do not have official M3 guidelines

| Component    | HTML               | Extends | ARIA Role | Implements |  Status  |
| :----------- | :----------------- | :-----: | :-------: | :--------- | :------: |
| ~~Backdrop~~ |                    |         |           |            | no plans |
| Banner       | `<mdw-banner>`     |         |           |            | rewrite  |
| Data Table   |                    |         |           |            | rewrite  |
| Image List   |                    |         |           |            | rewrite  |
| Side Sheet   | `<mdw-side-sheet>` |         |           |            | rewrite  |

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
