## API Reference (generated on release)

Generated API artifacts are published to npm on release. The generated files
live in `/api`.

### Custom Elements Manifest (custom-elements.json)

- **Purpose:** machine-readable metadata describing the library's custom elements, mixins, members, attributes, demos and more, suitable for documentation indexing and metadata extraction.
- **Location:** generated at release time and published to npm in `/api/custom-elements.json`.

**What the file contains**
- **`schemaVersion`**: manifest schema version.
- **`modules`**: array of modules analyzed (each item shows `path`, `kind`, and `declarations`).
- **`declarations`**: per-module list of things found (classes, mixins, etc.). For custom elements, common fields include:
  - `kind`: usually `class` or `mixin`.
  - `name`: JS symbol name.
  - `tagName`: the custom element tag (for element classes), e.g. `mdw-button`.
  - `attributes`: public attributes the element observes.
  - `members`: properties and methods extracted from the source.
  - `events`, `slots`, `cssParts`, `demos`: optional extra metadata.
  - `mixins`: mixins applied to the class (often important for behavior/docs).

See: https://github.com/webcomponents/custom-elements-manifest
