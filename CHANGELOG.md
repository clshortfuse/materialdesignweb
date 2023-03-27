v0.7.1
------

* Drop CSS Import
* Normalize `vertical-align` across components
* Add CLI theme generator
* Distribute bundle over NPM

v0.7.0
------

* Update to MD3
* Use Web Components
* Create custom render framework
* Drop custom adapters

v0.5.0
------

* Drop IE11
* Drop Opera Mini
* Rewrite JS Syntax targetting >1% browsers
* Prefer modern DOM APIs
* Use CSS Logical properties and values

* Search: (BREAKING) Use Promises instead of NodeJS-style callbacks
* Elevation: Add Dark Theme opacity

v0.4.0
------

* Use passive listener for DOMAdapter scrolling
* Workaround Safari 12 negative vertical-align bug
* Add `"aria-hidden"` attributes for `.mdw-layout__appbar` and `.mdw-layout__bottomnav`
* Add `"aria-hidden"` attributes for `.mdw-menu__check` and `.mdw-menu__radio`
* Create `.mdw-menu__item-group` CSS
* Ignore case on user agent detection (`Document.onPrerender`)
* Add `core/theme` helper functions

* Deprecate IE11 support
* Deprecate `.pug`

* Refactor SCSS for proper `@use` support
* Refactor SCSS with `math.div`
* Add `.eta` templates
* Target ES2020 for `.js`
* Proper ES Module support
* Upgrade dev dependencies
  * `webpack` from `4.x` to `5.x`
  * `webpack-dev-server` from `3.x` to `4.x`
  * `typescript` from `3.9.x` to `4.5.x`

