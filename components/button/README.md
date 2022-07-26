# Syntax


## Elevated
```html
  <mdw-button mdw-elevated>Elevated</mdw-button>
  <mdw-button aria-disabled=true mdw-elevated>Elevated (disabled)</mdw-button>
  <mdw-button mdw-elevated mdw-icon=search>Elevated icon</mdw-button>
  <mdw-button mdw-elevated mdw-color="surface" mdw-ink="tertiary">Elevated Surface-Tertiary</mdw-button>
```

## Filled
```html
  <mdw-button mdw-filled>Filled button</mdw-button>
  <mdw-button aria-disabled=true mdw-filled>Filled button (Disabled)</mdw-button>
```

## Filled Tonal
```html
  <mdw-button mdw-filled=tonal>Filled tonal button</mdw-button>
  <mdw-button aria-disabled=true mdw-filled=tonal>Filled tonal button (Disabled)</mdw-button>
  <mdw-button mdw-filled=tonal mdw-icon=search>Filled tonal button</mdw-button>
```

## Outlined
```html
  <mdw-button mdw-outlined>Outlined</mdw-button>
  <mdw-button mdw-outlined mdw-icon=add>Outlined icon</mdw-button>
  <mdw-button mdw-outlined="surface" mdw-icon=add>Outlined surface icon</mdw-button>
  <mdw-button aria-disabled=true mdw-outlined>Outlined (Disabled)</mdw-button>
  <mdw-button aria-disabled=true mdw-outlined mdw-icon=add>Outlined icon (Disabled)</mdw-button>
```

## Text
```html
  <mdw-button>Text</mdw-button>
  <mdw-button mdw-ink=tertiary mdw-icon=add>Tertiary</mdw-button>
  <mdw-button mdw-ink=tertiary aria-disabled=true>Text (Disabled)</mdw-button>
  <mdw-button mdw-ink=primary aria-disabled=true mdw-icon=add>Icon text (Disabled)</mdw-button>
```

## Custom
```html
  <mdw-button class=mdw-custom mdw-ink=yellow>Custom text</mdw-button>
  <mdw-button class=mdw-custom mdw-elevated mdw-ink=yellow>Custom elevated</mdw-button>
  <mdw-button class=mdw-custom mdw-filled mdw-color=yellow>Custom filled</mdw-button>
  <mdw-button class=mdw-custom mdw-filled=tonal mdw-icon=add mdw-color=yellow-container>Custom tonal</mdw-button>
  <mdw-button class=mdw-custom mdw-outlined mdw-ink=yellow>Custom outlined</mdw-button>
  <mdw-button aria-disabled=true mdw-outlined>Outlined (Disabled)</mdw-button>
  <mdw-button aria-disabled=true mdw-outlined mdw-icon=add>Outlined icon (Disabled)</mdw-button>
  <mdw-button aria-disabled=true class=mdw-custom mdw-ink=yellow>Custom text</mdw-button>
  <mdw-button aria-disabled=true class=mdw-custom mdw-elevated=yellow>Custom elevated</mdw-button>
  <mdw-button aria-disabled=true mdw-filled class=mdw-custom mdw-color=yellow>Custom filled</mdw-button>
  <mdw-button aria-disabled=true mdw-filled=tonal class=mdw-custom mdw-icon=add mdw-color=yellow-container>Custom tonal</mdw-button>
```

```js
  import MDWButton from "components/button/MDWButton.js";

  MDWButton.register()
```
