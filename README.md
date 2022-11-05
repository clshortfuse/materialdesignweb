# Note

`master` branch has been been soft-archived. All new work is being done at https://github.com/clshortfuse/materialdesignweb/tree/native

# materialdesignweb
Material Design for Web

# Demo

https://clshortfuse.github.io/materialdesignweb/

# Getting started

npm: `npm install @shortfuse/materialdesignweb`

# Core modules

| Module | CSS-Only Support | Description | status
| :-------- | :-: | :- | :- |
| [aria](core/aria/) | :x: | Handles ARIA attributes, ARIA roles, tabindexes, and keyboard interaction | preRC
| [document](core/document/) | :white_check_mark: | Applies color-scheme, standalone-window, and user agents detection | RC
| [overlay](core/overlay/) | :white_check_mark: | Applies overlay states to components | RC
| [ripple](core/ripple/) | :white_check_mark: | Applies press ripple on interactions | preRC
| [theme](core/theme/) | :white_check_mark: | Applies ink and surface colors based on light/dark context | preRC
| [transition](core/transition/) | :x: | Transitions shape and content between elements | preRC

# Component Modules

| Component | Integrations | CSS-Only Support | Keyboard Support | ARIA Role | ARIA Attributes | Status
| :-------- | :----------: | :--------------: | :--------------: | :------:  | :-------------: | :-----
| [appbar](components/appbar/) | button | :white_check_mark: | N/A | :x: | :x: | beta
| backdrop | | | | | | *planned*
| [banner](components/banner/) | button | :white_check_mark: | N/A | :x: | :x: | beta
| [bottomnav](components/bottomnav/) | bottomnavitem† overlay | :x: | :white_check_mark: | tablist | aria-multiselectable aria-orientation | RC
| [bottomnavitem](components/bottomnav/item.js) | overlay ripple | :x: | :white_check_mark: | [tab](utils/aria/tab.js) | aria-selected | RC
| [button](components/button/) | overlay ripple | :white_check_mark: | :white_check_mark: | [button](utils/aria/button.js) | aria-disabled‡ aria-pressed‡ | stable
| [card](components/card/) | button divider | :white_check_mark: | N/A | :x: | :x: | preRC
| [chip](components/chip/) | chipitem | :white_check_mark: | :x: | :x: | :x: | alpha
| [chipitem](components/chip/item.js) | :x: | :x: | :x: | :x: | :x: | alpha
| [datatable](components/datatable/) | button | :white_check_mark: | :white_check_mark: | grid | aria-selected | preRC
| [dialog](components/dialog/) | button | :white_check_mark: | :white_check_mark: | dialog | aria-modal | preRC
| [divider](components/divider/) |  | :white_check_mark:| | separator‡ | | preRC
| [elevation](components/elevation/) | | :white_check_mark: | | | | RC
| [fab](components/fab/) | button†  | :white_check_mark:| :x: |:x: | :x: | beta
| [grid](components/grid/) |  | :white_check_mark:| | :x: | :x: | preRC
| imagelist | | | | | | *use grid*
| [layout](components/layout/) | | :white_check_mark: | :x: |:x: | :x: | beta
| [list](components/list/) | listitem† listexpander | :white_check_mark: | :white_check_mark: | group list listbox radiogroup tree | aria-orientation | preRC
| [listcontent](components/list/content.js) | overlay ripple | :white_check_mark: | :white_check_mark: | listitem link option radio treeitem | aria-checked aria-selected | preRC
| [listitem](components/list/item.js) | | :white_check_mark: | :white_check_mark: | treeitem none | aria-expanded aria-hidden | preRC
| [listsecondary](components/list/secondary.js) |  | :white_check_mark: | :white_check_mark: | none‡ | | preRC
| [menu](components/menu/) | divider menuitem† | :white_check_mark: | :white_check_mark: | menu | aria-hidden | preRC
| [menuitem](components/menu/item.js) | overlay ripple | :white_check_mark: | :white_check_mark:| menuitem menuitemradio menuitemcheckbox | aria-disabled aria-checked | stable
| navdrawer | | | | | | *use layout*
| [progress](components/progress/) |  | :white_check_mark:| | :x: | :x: | beta
| [selection](components/selection/) | | :white_check_mark: | :white_check_mark: | checkbox‡ radio‡ | aria-checked aria-disabled | preRC
| sidesheet | | | | | | *use layout*
| [slider](components/slider/) | | :white_check_mark: | :x: | :x: | :x: | alpha
| [snackbar](components/snackbar/) | button | :white_check_mark: | :white_check_mark: | alert | aria-hidden | RC
| [tab](components/tab/) | tablist tabcontent | :x: |  |  | | RC
| [tabcontent](components/tab/content.js) | tabpanel† | :x: | :white_check_mark: | | | RC
| [tabitem](components/tab/item.js) | overlay ripple | :x: | :white_check_mark: | [tab](utils/aria/tab.js) | aria-selected | RC
| [tablist](components/tab/list.js) | tabitem† overlay | :x: | :white_check_mark: | tablist | aria-multiselectable aria-orientation | RC
| [tabpanel](components/tab/panel.js) | | :x: | :white_check_mark: | tabpanel | aria-expanded aria-hidden | RC
| [textfield](components/textfield/) | list | :white_check_mark: | :white_check_mark: | :x: | :x: | preRC
| [tooltip](components/tooltip/) | | :white_check_mark: | | :x: | :x: | beta
| [type](components/type/) | | :white_check_mark: | | | | RC

# Adapter classes
| Adapter | Components | Status
| :-------- | :-- | :-
| [datatable](adapters/datatable/) | button datatable† | preRC
| [dom](adapters/dom/) | | preRC
| [list](adapters/list/) | domadapter† listitem† | preRC
| [search](adapters/search/) | list† textfield† | preRC

## Legend

* planned - Planned for later
* draft - Not yet functional
* alpha - Partially working
* beta - Working but incomplete
* preRC - Needs minor changes
* RC - Needs testing as-is
* stable - Production-ready


* † - Required

* ‡ - Apply manually
