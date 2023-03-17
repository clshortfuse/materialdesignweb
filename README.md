# Note

`master` branch has been been soft-archived. All new work is being done at https://github.com/clshortfuse/materialdesignweb/tree/native

# materialdesignweb
Material Design for Web

# About

A standards-focused, zero-dependency implemention of Material Design 3 (Material You).

# Current status

Working on:
* Array rendering (sub templates)
* * Nav Drawer list population
* * Search results population
* * Text Field Dropdown population
* Cross-DOM-boundary custom colors

# Demo

https://rawcdn.githack.com/clshortfuse/materialdesignweb/9542d1c/docs/

# Getting started

````html
<link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block" />

<script type="module" src="https://rawcdn.githack.com/clshortfuse/materialdesignweb/9542d1c/theming/loader.js?color=6750A4&custom=yellow,orange:orange,green:0f0,alias:aqua&lightness=auto"></script>

<script type="module" src="https://rawcdn.githack.com/clshortfuse/materialdesignweb/9542d1c/components/Button.js"></script>

<mdw-button>Hello World!</mdw-button>
````

# Support

* Unbundled: Chrome >=94
* Bundled: >1% browsers *(polyfills not included)*

# Legend

* [:paintbrush:](# "Background") - Background Theming
* [:crayon:](# "Ink") - Ink (Foreground) Theming	
* [:o:](# "Outline") - Outline
* [:a:](# "Font") - Font Theming	
* [:large_blue_diamond:](# "Shape") - Shape Size Theming
* [:signal_strength:](# "Density") - Density
* [:arrow_up_down:](# "Flexable") - Flexable layout
* [:wheelchair:](# "ARIA") - ARIA Role
  
* [:heavy_check_mark:](# "Ready") - Ready
* [:warning:](# "Issues") - Issues
* [:construction:](# "Under Construction") - Under Construction
* [:memo:](# "Planned") - Planned
* [:grey_question:](# "Unknown") - Unknown
* [:skull:](# "Not planned") - Not planned

# Components

| Component                                                    | Features                                                                                                                                                                                                          |                  Status                  |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------: |
| [Badge](components/Badge.js)                                 | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density")                                                          |     [:heavy_check_mark:](# "Ready")      |
| [Bottom App Bar](components/BottomAppBar.js)                 | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape")  [:wheelchair:](# "ARIA Toolbar")                                                         |     [:heavy_check_mark:](# "Ready")      |
| Bottom Sheet                                                 |                                                                                                                                                                                                                   |          [:memo:](# "Planned")           |
| [Button](components/Button.md)                               | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Button")                          |     [:heavy_check_mark:](# "Ready")      |
| [Card](components/Card.js)                                   | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:arrow_up_down:](# "Flexable") [:wheelchair:](# "ARIA Figure")                           |     [:heavy_check_mark:](# "Ready")      |
| [Fab](components/Fab.js)                                     | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Button")                          |     [:heavy_check_mark:](# "Ready")      |
| [Fab - Extended](components/ExtendedFab.js)                  | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density")  [:wheelchair:](# "ARIA Button")                         |     [:heavy_check_mark:](# "Ready")      |
| [Icon Button](components/IconButton.js)                      | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Button \| Checkbox")              |     [:heavy_check_mark:](# "Ready")      |
| [Segmented Button](components/SegmentedButton.js)            | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density")  [:wheelchair:](# "ARIA Option")                         |     [:heavy_check_mark:](# "Ready")      |
| [Segmented Button Group](components/SegmentedButtonGroup.js) | [:crayon:](# "Ink") [:wheelchair:](# "ARIA Listbox")                                                                                                                                                              |     [:heavy_check_mark:](# "Ready")      |
| [Checkbox](components/Checkbox.js)                           | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Checkbox")                                                                            |     [:heavy_check_mark:](# "Ready")      |
| [Chip](components/Chip.js)                                   | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Button")                          |     [:heavy_check_mark:](# "Ready")      |
| [Chip - Filter](components/FilterChip.js)                    | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Checkbox \| Radio")               |     [:heavy_check_mark:](# "Ready")      |
| Chip: Filter Dropdown                                        |                                                                                                                                                                                                                   | [:construction:](# "Under Construction") |
| Chip: Input                                                  |                                                                                                                                                                                                                   | [:construction:](# "Under Construction") |
| Date Picker                                                  |                                                                                                                                                                                                                   |      [:grey_question:](# "Unknown")      |
| [Dialog](components/Dialog.js)                               | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Dialog")                                                           |     [:heavy_check_mark:](# "Ready")      |
| Dialog: Full-screen                                          |                                                                                                                                                                                                                   |      [:grey_question:](# "Unknown")      |
| [Divider](components/Divider.js)                             | [:crayon:](# "Ink")                                                                                                                                                                                               |     [:heavy_check_mark:](# "Ready")      |
| [Icon](components/Icon.js)                                   | [:crayon:](# "Ink")                                                                                                                                                                                               |     [:heavy_check_mark:](# "Ready")      |
| [List](components/List.js)                                   | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA List")                                                                                                 |     [:heavy_check_mark:](# "Ready")      |
| [List Select](components/ListSelect.js)                      | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Option")                                                                                               |     [:heavy_check_mark:](# "Ready")      |
| [Menu](components/Menu.js)                                   | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Menu")                                                                              |     [:heavy_check_mark:](# "Ready")      |
| [Navigation Bar](components/NavBar.js)                       | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Nav")                                                                              |     [:heavy_check_mark:](# "Ready")      |
| [Navigation Drawer](components/NavDrawer.js)                 | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Nav")                                                                              | [:construction:](# "Under Construction") |
| [Navigation Rail](components/NavDrawer.js)                   | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Nav")                                                                              |     [:heavy_check_mark:](# "Ready")      |
| [Progress Indicators](components/Progress.js)                | [:crayon:](# "Ink") [:wheelchair:](# "ARIA Progress")                                                                                                                                                             |     [:heavy_check_mark:](# "Ready")      |
| Search                                                       |                                                                                                                                                                                                                   |          [:memo:](# "Planned")           |
| [Radio](components/Radio.js)                                 | [:crayon:](# "Ink") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Radio")                                                                                                              |     [:heavy_check_mark:](# "Ready")      |
| [Slider](components/Slider.js)                               | [:crayon:](# "Ink")  [:wheelchair:](# "ARIA Slider")                                                                                                                                                              |         [:warning:](# "Issues")          |
| [Snackbar](components/Snackbar.js)                           | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Status")                                          |     [:heavy_check_mark:](# "Ready")      |
| [Switch](components/Switch.js)                               | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:a:](# "Font") [:wheelchair:](# "ARIA Switch")                                                                                                                |     [:heavy_check_mark:](# "Ready")      |
| [Surface](components/Surface.js)                             | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:arrow_up_down:](# "Flexable")                                                           |     [:heavy_check_mark:](# "Ready")      |
| [Tab](components/Tab.js)                                     | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Tab List \| Tab \| Tab Panel")                                                     |     [:heavy_check_mark:](# "Ready")      |
| [Text Input](components/Input.js)                            | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Textbox")                         |     [:heavy_check_mark:](# "Ready")      |
| [Text Area](components/TextArea.js)                          | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Textarea")                        |     [:heavy_check_mark:](# "Ready")      |
| [Text Select](components/Select.js)                          | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:wheelchair:](# "ARIA Combobox")                        |     [:heavy_check_mark:](# "Ready")      |
| Time Picker                                                  |                                                                                                                                                                                                                   |      [:grey_question:](# "Unknown")      |
| [Tooltip](components/Tooltip.js)                             | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:large_blue_diamond:](# "Shape") [:wheelchair:](# "ARIA Tooltip")                                                                          |     [:heavy_check_mark:](# "Ready")      |
| [Top App Bar](components/TopAppBar.js)                       | [:paintbrush:](# "Background") [:crayon:](# "Ink") [:o:](# "Outline") [:a:](# "Font") [:large_blue_diamond:](# "Shape") [:signal_strength:](# "Density") [:arrow_up_down:](# "Flexable") [:wheelchair:](# "ARIA") |     [:heavy_check_mark:](# "Ready")      |

# Additional

| Component                          | Description                                         |                  Status                  |
| :--------------------------------- | :-------------------------------------------------- | :--------------------------------------: |
| [Box](components/Box.js)           | Simple themeable component with Flexbox options     |     [:heavy_check_mark:](# "Ready")      |
| [Layout](components/Layout.js)     | Manages page nav, and pane layouts                  | [:construction:](# "Under Construction") |
| [Pane](components/Pane.js)         | 12-column pane layout                               | [:construction:](# "Under Construction") |
| [Icon](components/Icon.js)         | Font-icon, SVG, and IMG support                     | [:construction:](# "Under Construction") |
| [Body](components/Body.js)         | Box with Body typography                            |     [:heavy_check_mark:](# "Ready")      |
| [Label](components/Label.js)       | Box with Label typography                           |     [:heavy_check_mark:](# "Ready")      |
| [Headline](components/Headline.js) | Box with Headline typography                        |     [:heavy_check_mark:](# "Ready")      |
| [Title](components/Title.js)       | Box with Title typography                           |     [:heavy_check_mark:](# "Ready")      |
| [Ripple](components/Ripple.js)     | Ripple effect                                       |     [:heavy_check_mark:](# "Ready")      |
| [Surface](components/Surface.js)   | Themeable, flexable, shapeable, elevateable element |     [:heavy_check_mark:](# "Ready")      |


# Mixins

| Component                                        | Description                                      |                  Status                  |
| :----------------------------------------------- | :----------------------------------------------- | :--------------------------------------: |
| [ARIA Reflector](mixins/AriaReflectorMixin.js)   | Reflects ARIA Properties                         |     [:heavy_check_mark:](# "Ready")      |
| [ARIA Toolbar](mixins/AriaToolbarMixin.js)       | Shared ARIA Toolbar functionality                |     [:heavy_check_mark:](# "Ready")      |
| [Control](mixins/ControlMixin.js)                | HTML Control wrapper                             |     [:heavy_check_mark:](# "Ready")      |
| [Density](mixins/DensityMixin.js)                | Component density options                        |     [:heavy_check_mark:](# "Ready")      |
| [Flexable](mixins/FlexableMixin.js)              | Add flexbox options as attributes                |     [:heavy_check_mark:](# "Ready")      |
| [Form Associated](mixins/FormAssociatedMixin.js) | Form-associated custom element support           |     [:heavy_check_mark:](# "Ready")      |
| [Input](mixins/InputMixin.js)                    | HTMLInputElement wrapper                         |     [:heavy_check_mark:](# "Ready")      |
| [Keyboard Nav](mixins/KeyboardNavMixin.js)       | Adds arrow key navigation and roving tab index   |         [:warning:](# "Issues")          |
| [Resize Observer](mixins/ResizeObserverMixin.js) | Shared Eelement resize observer                  |     [:heavy_check_mark:](# "Ready")      |
| [Ripple](mixins/RippleMixin.js)                  | Replaces pressed state with ripple effect        |     [:heavy_check_mark:](# "Ready")      |
| [RTL Observer](mixins/RTLObserverMixin.js)       | Shared RTL paoge observer                        |     [:heavy_check_mark:](# "Ready")      |
| [Scroll Listener](mixins/ScrollListenerMixin.js) | Listen for horizontal and vertical scroll events |     [:heavy_check_mark:](# "Ready")      |
| [Shape](mixins/ShapeMixin.js)                    | Adds shape and outline layer to elements         |         [:warning:](# "Issues")          |
| [Surface](mixins/ShapeMixin.js)                  | Adds elevation tint and shadows to elements      |         [:warning:](# "Issues")          |
| [Text Field](mixins/TextFieldMixin.js)           | Shared text field functionality                  |     [:heavy_check_mark:](# "Ready")      |
| [Tooltip Trigger](mixins/TooltipTriggerMixin.js) | Triggers tooltips based on events                | [:construction:](# "Under Construction") |
| [Touch Target](mixins/TouchTargetMixin.js)       | Adds extended touch target to controls           | [:construction:](# "Under Construction") |

# Core

| File                                   | Description                                                                |                  Status                  |
| :------------------------------------- | :------------------------------------------------------------------------- | :--------------------------------------: |
| [Composition](core/Composition.js)     | Composes templates based on styles, fragments, and watches. Renders data   | [:construction:](# "Under Construction") |
| [CustomElement](core/CustomElement.js) | Handles ShadowDOM, ElementInternals, Property attributes, and compositions | [:construction:](# "Under Construction") |
| [css](core/css.js)                     | CSS, CSSStyleSheet, HTMLStyleElement functions                             |     [:heavy_check_mark:](# "Ready")      |
| [customTypes](core/customTypes.js)     | Non-primitive observable types                                             | [:construction:](# "Under Construction") |
| [dom](core/dom.js)                     | DOM functions                                                              |         [:warning:](# "Issues")          |
| [identify](core/identify.js)           | Node identification functions                                              | [:construction:](# "Under Construction") |
| [observe](core/observe.js)             | Observable pattern for primitives and objects                              | [:construction:](# "Under Construction") |
| [template](core/template.js)           | Template literals for CSS (CSSStyleSheet) and HTML (DocumentFragment)      |     [:heavy_check_mark:](# "Ready")      |


# Other Components

These components do not have official M3 guidelines

| Component    |                  Status                  |
| :----------- | :--------------------------------------: |
| ~~Backdrop~~ |        [:skull:](# "Not planned")        |
| Banner       | [:construction:](# "Under Construction") |
| Data Table   |          [:memo:](# "Planned")           |
| Image List   |      [:grey_question:](# "Unknown")      |
| Side Sheet   |      [:grey_question:](# "Unknown")      |
