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

https://rawcdn.githack.com/clshortfuse/materialdesignweb/3f03468/docs/

# Getting started

````html
<link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&display=block" />

<script type="module" src="https://rawcdn.githack.com/clshortfuse/materialdesignweb/3f03468/theming/loader.js?color=6750A4&custom=yellow,orange:orange,green:0f0,alias:aqua&lightness=auto"></script>

<script type="module" src="https://rawcdn.githack.com/clshortfuse/materialdesignweb/3f03468/components/Button.js"></script>

<mdw-button>Hello World!</mdw-button>
````

# Support

* Unbundled: Chrome >=94
* Bundled: >1% browsers *(polyfills not included)*

# Legend

* [:paintbrush:](a "Background") - Background Theming
* [:crayon:](a "Ink") - Ink (Foreground) Theming	
* [:o:](a "Outline") - Outline
* [:a:](a "Font") - Font Theming	
* [:large_blue_diamond:](a "Shape") - Shape Size Theming
* [:signal_strength:](a "Density") - Density
* [:arrow_up_down:](a "Flexable") - Flexable layout
* [:wheelchair:](a "ARIA") - ARIA Role
  
* [:heavy_check_mark:](a "Ready") - Ready
* [:warning:](a "Issues") - Issues
* [:construction:](a "Under Construction") - Under Construction
* [:memo:](a "Planned") - Planned
* [:grey_question:](a "Unknown") - Unknown
* [:skull:](a "Abandoned") - Abandoned

# Components

| Component                                                    | Features                                                                                                                                                                                                  |            Status             |
| :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------: |
| [Badge](components/Badge.js)                                 | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density")                                                        |      :heavy_check_mark:       |
| [Bottom App Bar](components/BottomAppBar.js)                 | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape")  [:wheelchair:](a "ARIA Toolbar")                                                       |      :heavy_check_mark:       |
| Bottom Sheet                                                 |                                                                                                                                                                                                           |     [:memo:](a "Planned")      |
| [Button](components/Button.md)                               | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Button")                         |      :heavy_check_mark:       |
| [Card>](components/Card.js)                                  | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:arrow_up_down:](a "Flexable") [:wheelchair:](a "ARIA Figure")                          |      :heavy_check_mark:       |
| [Fab](components/Fab.js)                                     | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Button")                         |      :heavy_check_mark:       |
| [Fab - Extended](components/ExtendedFab.js)                  | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density")  [:wheelchair:](a "ARIA Button")                        |      :heavy_check_mark:       |
| [Icon Button](components/IconButton.js)                      | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Button \| Checkbox")             |      :heavy_check_mark:       |
| [Segmented Button](components/SegmentedButton.js)            | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density")  [:wheelchair:](a "ARIA Option")                        |      :heavy_check_mark:       |
| [Segmented Button Group](components/SegmentedButtonGroup.js) | [:crayon:](a "Ink") [:wheelchair:](a "ARIA Listbox")                                                                                                                                                        |      :heavy_check_mark:       |
| [Checkbox>](components/Checkbox.js)                          | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Checkbox")                                                                         |      :heavy_check_mark:       |
| [Chip](components/Chip.js)                                   | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Button")                         |      :heavy_check_mark:       |
| [Chip - Filter](components/FilterChip.js)                    | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Checkbox \| Radio")              |      :heavy_check_mark:       |
| Chip: Filter Dropdown                                        |                                                                                                                                                                                                           |        :construction:         |
| Chip: Input                                                  |                                                                                                                                                                                                           |        :construction:         |
| Date Picker                                                  |                                                                                                                                                                                                           | [:grey_question:](a "Unknown") |
| [Dialog>](components/Dialog.js)                              | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Dialog")                                                         |      :heavy_check_mark:       |
| Dialog: Full-screen                                          |                                                                                                                                                                                                           | [:grey_question:](a "Unknown") |
| [Divider](components/Divider.js)                             | [:crayon:](a "Ink")                                                                                                                                                                                        |      :heavy_check_mark:       |
| [Icon](components/Icon.js)                                   | [:crayon:](a "Ink")                                                                                                                                                                                        |      :heavy_check_mark:       |
| [List](components/List.js)                                   | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA List")                                                                                             |      :heavy_check_mark:       |
| [List Select](components/ListSelect.js)                      | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Option")                                                                                           |      :heavy_check_mark:       |
| [Menu](components/Menu.js)                                   | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Menu")                                                                           |      :heavy_check_mark:       |
| [Navigation Bar](components/NavBar.js)                       | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Nav")                                                                           |      :heavy_check_mark:       |
| [Navigation Drawer](components/NavDrawer.js)                 | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Nav")                                                                           |        :construction:         |
| [Navigation Rail](components/NavDrawer.js)                   | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Nav")                                                                           |      :heavy_check_mark:       |
| [Progress Indicators](components/Progress.js)                | [:crayon:](a "Ink") [:wheelchair:](a "ARIA Progress")                                                                                                                                                       |      :heavy_check_mark:       |
| Search                                                       |                                                                                                                                                                                                           |     [:memo:](a "Planned")      |
| [Radio](components/Radio.js)                                 | [:crayon:](a "Ink") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Radio")                                                                                                          |      :heavy_check_mark:       |
| [Slider](components/Slider.js)                               | [:crayon:](a "Ink")  [:wheelchair:](a "ARIA Slider")                                                                                                                                                        |      :heavy_check_mark:       |
| [Snackbar](components/Snackbar.js)                           | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Status")                                        |      :heavy_check_mark:       |
| [Switch](components/Switch.js)                               | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:a:](a "Font") [:wheelchair:](a "ARIA Switch")                                                                                                            |      :heavy_check_mark:       |
| [Surface](components/Surface.js)                             | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:arrow_up_down:](a "Flexable")                                                         |      :heavy_check_mark:       |
| [Tab](components/Tab.js)                                     | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Tab List \| Tab \| Tab Panel")                                                  |      :heavy_check_mark:       |
| [Text Input](components/Input.js)                            | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Textbox")                        |      :heavy_check_mark:       |
| [Text Area](components/TextArea.js)                          | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Textarea")                       |      :heavy_check_mark:       |
| [Text Select](components/Select.js)                          | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:wheelchair:](a "ARIA Combobox")                       |      :heavy_check_mark:       |
| Time Picker                                                  |                                                                                                                                                                                                           | [:grey_question:](a "Unknown") |
| [Tooltip](components/Tooltip.js)                             | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:large_blue_diamond:](a "Shape") [:wheelchair:](a "ARIA Tooltip")                                                                       |      :heavy_check_mark:       |
| [Top App Bar](components/TopAppBar.js)                       | [:paintbrush:](a "Background") [:crayon:](a "Ink") [:o:](a "Outline") [:a:](a "Font") [:large_blue_diamond:](a "Shape") [:signal_strength:](a "Density") [:arrow_up_down:](a "Flexable") [:wheelchair:](a "ARIA") |      :heavy_check_mark:       |

# Additional

| Component                          | Description                                         |       Status       |
| :--------------------------------- | :-------------------------------------------------- | :----------------: |
| [Box](components/Box.js)           | Simple themeable component with Flexbox options     | :heavy_check_mark: |
| [Layout](components/Layout.js)     | Manages page nav, and pane layouts                  |   :construction:   |
| [Pane](components/Pane.js)         | 12-column pane layout                               |   :construction:   |
| [Icon](components/Icon.js)         | Font-icon, SVG, and IMG support                     |   :construction:   |
| [Body](components/Body.js)         | Box with Body typography                            | :heavy_check_mark: |
| [Label](components/Label.js)       | Box with Label typography                           | :heavy_check_mark: |
| [Headline](components/Headline.js) | Box with Headline typography                        | :heavy_check_mark: |
| [Title](components/Title.js)       | Box with Title typography                           | :heavy_check_mark: |
| [Ripple](components/Ripple.js)     | Ripple effect                                       | :heavy_check_mark: |
| [Surface](components/Surface.js)   | Themeable, flexable, shapeable, elevateable element | :heavy_check_mark: |


# Mixins

| Component                                        | Description                                      |       Status       |
| :----------------------------------------------- | :----------------------------------------------- | :----------------: |
| [ARIA Reflector](mixins/AriaReflectorMixin.js)   | Reflects ARIA Properties                         | :heavy_check_mark: |
| [ARIA Toolbar](mixins/AriaToolbarMixin.js)       | Shared ARIA Toolbar functionality                | :heavy_check_mark: |
| [Control](mixins/ControlMixin.js)                | HTML Control wrapper                             | :heavy_check_mark: |
| [Density](mixins/DensityMixin.js)                | Component density options                        | :heavy_check_mark: |
| [Flexable](mixins/FlexableMixin.js)              | Add flexbox options as attributes                | :heavy_check_mark: |
| [Form Associated](mixins/FormAssociatedMixin.js) | Form-associated custom element support           | :heavy_check_mark: |
| [Input](mixins/InputMixin.js)                    | HTMLInputElement wrapper                         | :heavy_check_mark: |
| [Keyboard Nav](mixins/KeyboardNavMixin.js)       | Adds arrow key navigation and roving tab index   |     :warning:      |
| [Resize Observer](mixins/ResizeObserverMixin.js) | Shared Eelement resize observer                  | :heavy_check_mark: |
| [Ripple](mixins/RippleMixin.js)                  | Replaces pressed state with ripple effect        | :heavy_check_mark: |
| [RTL Observer](mixins/RTLObserverMixin.js)       | Shared RTL paoge observer                        | :heavy_check_mark: |
| [Scroll Listener](mixins/ScrollListenerMixin.js) | Listen for horizontal and vertical scroll events | :heavy_check_mark: |
| [Shape](mixins/ShapeMixin.js)                    | Adds shape and outline layer to elements         |     :warning:      |
| [Surface](mixins/ShapeMixin.js)                  | Adds elevation tint and shadows to elements      |     :warning:      |
| [Text Field](mixins/TextFieldMixin.js)           | Shared text field functionality                  | :heavy_check_mark: |
| [Tooltip Trigger](mixins/TooltipTriggerMixin.js) | Triggers tooltips based on events                |   :construction:   |
| [Touch Target](mixins/TouchTargetMixin.js)       | Adds extended touch target to controls           |   :construction:   |

# Core

| File                                   | Description                                                                |       Status       |
| :------------------------------------- | :------------------------------------------------------------------------- | :----------------: |
| [Composition](core/Composition.js)     | Composes templates based on styles, fragments, and watches. Renders data   |   :construction:   |
| [CustomElement](core/CustomElement.js) | Handles ShadowDOM, ElementInternals, Property attributes, and compositions |   :construction:   |
| [css](core/css.js)                     | CSS, CSSStyleSheet, HTMLStyleElement functions                             | :heavy_check_mark: |
| [customTypes](core/customTypes.js)     | Non-primitive observable types                                             |   :construction:   |
| [dom](core/dom.js)                     | DOM functions                                                              |     :warning:      |
| [identify](core/identify.js)           | Node identification functions                                              |   :construction:   |
| [observe](core/observe.js)             | Observable pattern for primitives and objects                              |   :construction:   |
| [template](core/template.js)           | Template literals for CSS (CSSStyleSheet) and HTML (DocumentFragment)      | :heavy_check_mark: |


# Other Components

These components do not have official M3 guidelines

| Component    |            Status             |
| :----------- | :---------------------------: |
| ~~Backdrop~~ |            :skull:            |
| Banner       |        :construction:         |
| Data Table   |            :memo:             |
| Image List   | [:grey_question:](a "Unknown") |
| Side Sheet   | [:grey_question:](a "Unknown") |
