# Layout

MDW is layout-first. Use layout components and attributes instead of custom CSS.
All spacing is explicit: use `gap` and `padding`.

## Layout primitives

- `mdw-root` — app-level container and shared regions
- `mdw-page` — responsive page shell (single or two-pane)
- `mdw-pane` — shaped, padded surface (managed by `mdw-page`)
- `mdw-grid` — responsive grid with column spans
- `mdw-box` — flexbox layout (row or column), spacing, alignment

## Example: simple page (no root)

```html
<mdw-box padding=pane gap=16>
  <mdw-headline size=large>Simple layout</mdw-headline>
  <mdw-body size=small>Use Box for vertical flow and spacing.</mdw-body>
</mdw-box>
```

## Example: simple dashboard (box + grid, single-pane)

```html
<mdw-top-app-bar headline="Demo"></mdw-top-app-bar>
<mdw-box padding=pane gap=16>
  <mdw-headline size=small>Dashboard</mdw-headline>
  <mdw-grid gap=16>
    <mdw-card outlined col-span=4 col-span-12=12>
      <mdw-box padding=16 gap=8>
        <mdw-title size=small>Card title</mdw-title>
        <mdw-body size=small>Card copy</mdw-body>
      </mdw-box>
    </mdw-card>
  </mdw-grid>
</mdw-box>
```

## Example: multi-pane shell

```html
<mdw-root>
  <mdw-top-app-bar slot=start headline="Demo"></mdw-top-app-bar>
  <mdw-page>
    <mdw-pane>
      <mdw-box padding=pane gap=16>
        <mdw-grid gap=16 y=stretch>
          <mdw-card outlined col-span=4 col-span-12=6>
            <mdw-box padding=16 gap=8>
              <mdw-title size=small>Card title</mdw-title>
              <mdw-body size=small>Card copy</mdw-body>
              <mdw-box row x=end>
                <mdw-button filled>Action</mdw-button>
              </mdw-box>
            </mdw-box>
          </mdw-card>
        </mdw-grid>
      </mdw-box>
    </mdw-pane>
  </mdw-page>
</mdw-root>
```

## Spacing rules (important)

- Components do not ship with margins. Use `gap` to create spacing.
- Layout components are unpadded by default. Use `padding` explicitly.
- `padding=pane` uses the shared pane padding token on both axes; use `padding-x` or `padding-y` to override one axis.
- Dividers do not add spacing; pair them with `gap` or `padding`.

## Child layout attributes (applied to children)

Used via `::slotted` rules in layout components:

- `col-span="1..12"` for `mdw-grid`
- `col-span="25%"|"50%"|"100%"` for `mdw-grid`
- responsive spans: `col-span-4`, `col-span-8`, `col-span-12`
- `flex-0`, `flex-1`, `flex-none` for `mdw-box`

## Default layout behavior

- `mdw-box` is flexbox by default (column direction); add `row` for horizontal layout.
- `mdw-box[block]` opts out of flex layout and renders as block.

## Flexbox attribute mapping

Applies to `mdw-box`, `mdw-grid`, `mdw-pane`:

| Attribute | CSS / behavior |
| --- | --- |
| `row` | `flex-direction: row` (default is column) |
| `x="start\|center\|end\|between\|around\|stretch\|baseline"` | `justify-content` |
| `y="start\|center\|end\|between\|around\|stretch\|baseline"` | `align-items` |
| `wrap` / `wrap="reverse"` | `flex-wrap: wrap` / `wrap-reverse` |
| `gap="4\|8\|12\|16\|20\|24\|<number>"` | `gap` |
| `padding="pane\|4\|8\|12\|16\|20\|24\|<number>"` | `padding` (pane = shared pane token) |
| `padding-x="pane\|4\|8\|12\|16\|20\|24\|<number>"` | `padding-inline` |
| `padding-y="pane\|4\|8\|12\|16\|20\|24\|<number>"` | `padding-block` |
| `inline` | `display: inline-flex` |
| `block` | `display: block` |

## Layout attributes by component

| Component | Layout role | Attributes |
| --- | --- | --- |
| `mdw-root` | Root layout regions | Slots (`start`, `bottom`, `bottom-fixed`, `end`) |
| `mdw-page` | Responsive page shell | `paneOne`, `paneTwo`, `paneTwoBreakpoint`, `paneTwoActive` |
| `mdw-pane` | Optional pane surface (managed by `mdw-page`) | Inherits Box layout attributes |
| `mdw-box` | Flexbox layout | `row`, `x`, `y`, `gap`, `padding`, `padding-x`, `padding-y`, `wrap`, `inline`, `block` |
| `mdw-grid` | Responsive grid | Inherits Box layout attributes + child spans (`col-span`, `col-span-4`, `col-span-8`, `col-span-12`) |
