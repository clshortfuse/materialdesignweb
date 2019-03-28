# materialdesignweb
Material Design for Web

# component modules

| Component | Integrations | CSS-Only Support | Keyboard Support | ARIA Role | ARIA Attributes | Status
| :-------- | :-- | :-: | :-: | :-  | :- | :-
| [appbar](components/appbar/) | button | :white-check-mark: | N/A | :x: | :x: | beta
| backdrop | | | | | | *planned*
| [banner](components/banner/) | button | :white-check-mark: | N/A | :x: | :x: | beta
| [bottomnav](components/bottomnav/) | bottomnavitem†, overlay | :x: | :white-check-mark: | tablist | aria-multiselectable aria-orientation | RC
| [bottomnavitem](components/bottomnav/item.js) | overlay, ripple | :x: | :white-check-mark: | [tab](utils/aria/tab.js) | aria-selected | RC
| [button](components/button/) | overlay, ripple | :white-check-mark: | :white-check-mark: | [button](utils/aria/button.js) | aria-disabled‡ aria-pressed‡ | stable
| [card](components/card/) | button, divider | :white-check-mark: | N/A | :x: | :x: | preRC
| [chip](components/chip/) | chipitem | :white-check-mark: | :x: | :x: | :x: | alpha
| [chipitem](components/chip/item.js) | :x: | :x: | :x: | :x: | :x: | alpha
| [datatable](components/datatable/) | button | :white-check-mark: | :white-check-mark: | grid | aria-selected | preRC
| [dialog](components/dialog/) | button | :white-check-mark: | :white-check-mark: | dialog | aria-modal | preRC
| [divider](components/divider/) |  | :white-check-mark:| | separator‡ | | preRC
| [elevation](components/elevation/) | | :white-check-mark: | | | | RC
| [fab](components/fab/) | button†  | :white-check-mark:| :x: |:x: | :x: | beta
| [grid](components/grid/) |  | :white-check-mark:| | :x: | :x: | preRC
| imagelist | | | | | | *use grid*
| [layout](components/layout/) | | :white-check-mark: | :x: |:x: | :x: | beta
| [list](components/list/) | listitem†, listexpander | :white-check-mark: | :x: | list, listbox | :x: | preRC
| [listcontent](components/list/content.js) | overlay, ripple | | :x: | link‡ | :x: | preRC
| [listexpander](components/list/expander.js) | | :x: | :x: | :x: | aria-expanded | beta
| [listitem](components/list/item.js) | overlay, ripple | :white-check-mark: | :x: | listitem, option‡ | aria-selected | preRC
| [menu](components/menu/) | divider, menuitem† | :white-check-mark: | :white-check-mark: | menu | aria-hidden | preRC
| [menuitem](components/menu/item.js) | overlay, ripple | :white-check-mark: | :white-check-mark:| menuitem, menuitemradio, menuitemcheckbox | aria-disabled, aria-checked | stable
| navdrawer | | | | | | *use layout*
| [progress](components/progress/) |  | :white-check-mark:| | :x: | :x: | beta
| [selection](components/selection/) | | :white-check-mark: | | checkbox‡ radio‡ | :x: | preRC
| sidesheet | | | | | | *use layout*
| [slider](components/slider/) | | :white-check-mark: | :x: | :x: | :x: | alpha
| [snackbar](components/snackbar/) | button | :white-check-mark: | :white-check-mark: | alert | aria-hidden | RC
| [tab](components/tab/) | tablist, tabcontent | :x: |  |  | | RC
| [tabcontent](components/tab/content.js) | tabpanel† | :x: | :white-check-mark: | | | RC
| [tabitem](components/tab/item.js) | overlay, ripple | :x: | :white-check-mark: | [tab](utils/aria/tab.js) | aria-selected | RC
| [tablist](components/tab/list.js) | tabitem†, overlay | :x: | :white-check-mark: | tablist | aria-multiselectable aria-orientation | RC
| [tabpanel](components/tab/panel.js) | | | tabpanel | :white-check-mark: | aria-expanded, aria-hidden | RC
| [textfield](components/textfield/) | list | :white-check-mark: | :white-check-mark: | :x: | :x: | preRC
| [tooltip](components/tooltip/) | | :white-check-mark: | | :x: | :x: | beta
| [type](components/type/) | | :white-check-mark: | | | | RC

# core modules

| Module | CSS-Only Support | Description | status
| :-------- | :-: | :- | :- |
| [overlay](core/overlay/) | :white-check-mark: | Applies overlay states to components | RC
| [ripple](core/ripple/) | :white-check-mark: | Applies press ripple on interactions | preRC
| [theme](core/ripple/) | :white-check-mark: | Applies color and fill based on light/dark context | preRC

# adapter classes
| Adapter | Components | Status
| :-------- | :-- | :-
| [datatable](adapters/datatable/) | button, datatable† | preRC
| [dom](adapters/dom/) | | preRC
| [list](adapters/list/) | listitem† | preRC
| [search](adapters/search/) | list†, textfield† | preRC

† Required

‡ Apply manually

----------

## Code Statuses

* planned - Planned for later
* draft - Not yet functional
* alpha - Parially working
* beta - Working, but incomplete
* preRC - Needs minor changes
* RC - Needs testing as-is
* stable - Production-ready

----

Demo: https://clshortfuse.github.io/materialdesignweb/

npm: `npm install @shortfuse/materialdesignweb`