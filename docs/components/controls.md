# Controls & Inputs

Controls are HTML-first. Drop tags in markup and use attributes for variants.
Use `gap` and `padding` from layout components for spacing.

## Common controls

- Buttons: `mdw-button`, `mdw-icon-button`, `mdw-fab`, `mdw-segmented-button`
- Selection: `mdw-checkbox`, `mdw-radio`, `mdw-switch`
- Inputs: `mdw-input`, `mdw-textarea`, `mdw-select`
- Chips: `mdw-chip`, `mdw-filter-chip`, `mdw-input-chip`
- Sliders: `mdw-slider`

## Example

```html
<mdw-box gap=12>
  <mdw-input label="Email" required></mdw-input>
  <mdw-textarea label="Message"></mdw-textarea>
  <mdw-box row x=end gap=8>
    <mdw-button outlined>Cancel</mdw-button>
    <mdw-button filled>Send</mdw-button>
  </mdw-box>
</mdw-box>
```

## Related demos

- Buttons: https://clshortfuse.github.io/materialdesignweb/components/buttons.html
- Inputs: https://clshortfuse.github.io/materialdesignweb/components/textinput.html
- Text Area: https://clshortfuse.github.io/materialdesignweb/components/textarea.html
- Select: https://clshortfuse.github.io/materialdesignweb/components/select.html
- Switches: https://clshortfuse.github.io/materialdesignweb/components/switches.html
- Sliders: https://clshortfuse.github.io/materialdesignweb/components/sliders.html
- Chips: https://clshortfuse.github.io/materialdesignweb/components/chips.html
