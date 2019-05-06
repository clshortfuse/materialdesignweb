# Syntax


## Flat
```
.mdw-button
```

## Raised
```
.mdw-button(mdw-raised)
```

## Colored (Primary)
```
.mdw-button.mdw-theme(mdw-ink="primary contrast")
```

## Colored (Custom)
```
.mdw-button.mdw-theme(mdw-ink="green contrast")
```

## Filled Light
```
.mdw-button.mdw-theme(mdw-surface="primary 100" mdw-light)
```

## Filled Dark
```
.mdw-button.mdw-theme(mdw-surface="secondary 600" mdw-dark)
```

## Toggled
```
.mdw-button(aria-pressed="true")
```

## Disabled
```
a.mdw-button(disabled)
button.mdw-button(disabled)
.mdw-button(aria-disabled="true")
```

## Icon Button
```
.mdw-button(mdw-icon).material-icons favorite
```

# Javascript

```
  [...document.getElementsByClassName("mdw-button")].forEach(Button.attach);
```

# Notes

The click ripple aftereffect is centered when using keyboard or when using only CSS. Initializing the element with Javascript will ensure the ripple will spawn from the cursor position.

Use of `HTMLElementButton` or `HTMLAnchorElement` is supported, but note that using interactive content descendents violates the HTML specifications. Therefore, some browsers may not apply interactive elements such as ripples.