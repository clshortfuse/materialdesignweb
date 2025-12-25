**Custom Elements Manifest (custom-elements.json)**

- **Purpose:** machine-readable metadata describing the library's custom elements, mixins, members, attributes, demos and more. Documentation tools use this file to index and present component metadata.
- **Location:** the canonical manifest is `docs/custom-elements.json` in this repository.

**What the file contains**
- **`schemaVersion`**: manifest schema version.
- **`modules`**: array of modules analyzed (each item shows `path`, `kind`, and `declarations`).
- **`declarations`**: per-module list of things found (classes, mixins, etc.). For custom elements you'll commonly see:
  - `kind`: usually `class` or `mixin`.
  - `name`: JS symbol name.
  - `tagName`: the custom element tag (for element classes), e.g. `mdw-button`.
  - `attributes`: public attributes the element observes.
  - `members`: properties and methods extracted from the source.
  - `events`, `slots`, `cssParts`, `demos`: optional extra metadata.
  - `mixins`: mixins applied to the class (often important for behavior/docs).

See: https://github.com/webcomponents/custom-elements-manifest