# Syntax


## Elevated
```html
  <mdw-button elevated>Elevated</mdw-button>
  <mdw-button disabled elevated>Elevated (disabled)</mdw-button>
  <mdw-button elevated icon=search>Elevated icon</mdw-button>
  <mdw-button elevated color=surface ink=tertiary>Elevated Surface-Tertiary</mdw-button>
```

## Filled
```html
  <mdw-button filled>Filled button</mdw-button>
  <mdw-button disabled filled>Filled button (Disabled)</mdw-button>
```

## Filled Tonal
```html
  <mdw-button filled=tonal>Filled tonal button</mdw-button>
  <mdw-button disabled filled=tonal>Filled tonal button (Disabled)</mdw-button>
  <mdw-button filled=tonal icon=search>Filled tonal button</mdw-button>
```

## Outlined
```html
  <mdw-button outlined>Outlined</mdw-button>
  <mdw-button outlined icon=add>Outlined icon</mdw-button>
  <mdw-button outlinedsurface icon=add>Outlined surface icon</mdw-button>
  <mdw-button disabled outlined>Outlined (Disabled)</mdw-button>
  <mdw-button disabled outlined icon=add>Outlined icon (Disabled)</mdw-button>
```

## Text
```html
  <mdw-button>Text</mdw-button>
  <mdw-button ink=tertiary icon=add>Tertiary</mdw-button>
  <mdw-button ink=tertiary disabled>Text (Disabled)</mdw-button>
  <mdw-button ink=primary disabled icon=add>Icon text (Disabled)</mdw-button>
```

## Custom
```html
  <mdw-button ink=yellow>Custom text</mdw-button>
  <mdw-button elevated ink=yellow>Custom elevated</mdw-button>
  <mdw-button filled color=yellow>Custom filled</mdw-button>
  <mdw-button filled=tonal icon=add color=yellow-container>Custom tonal</mdw-button>
  <mdw-button outlined ink=yellow>Custom outlined</mdw-button>
  <mdw-button disabled outlined>Outlined (Disabled)</mdw-button>
  <mdw-button disabled outlined icon=add>Outlined icon (Disabled)</mdw-button>
  <mdw-button disabled ink=yellow>Custom text</mdw-button>
  <mdw-button disabled elevated=yellow>Custom elevated</mdw-button>
  <mdw-button disabled filled color=yellow>Custom filled</mdw-button>
  <mdw-button disabled filled=tonal icon=add color=yellow-container>Custom tonal</mdw-button>
```

```js
  import Button from "components/Button.js";

  Button.register()
```
