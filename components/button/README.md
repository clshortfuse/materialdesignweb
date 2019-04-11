# Syntax


## Flat
```
.mdw-button
```

## Raised
```
.mdw-button(mdw-raised)
```

## Colored
```
.mdw-button.mdw-theme(mdw-ink="primary A200")
```

## Colored (Custom)
```
.mdw-button.mdw-theme(mdw-ink="green A100")
```

## Colored (Dark Themed)
```
.mdw-button.mdw-theme(mdw-ink="primary A200" mdw-dark)
```

## Filled
```
.mdw-button.mdw-theme(mdw-surface="primary 500")
```

## Filled (Custom Tone)
```
.mdw-button.mdw-theme(mdw-surface="secondary 500")
```

## Filled (Custom Tone)
```
.mdw-button(disabled)
```

## Icon Button
```
.mdw-button(mdw-icon).material-icons favorite
```

# Javascript

```
  [...document.getElementsByClassName("mdw-button")].forEach((element) => {
    Button.attach(element);  
  });
```

# Notes

The click ripple aftereffect is centered when using keyboard or when using only CSS. Initializing the element with Javascript will ensure the ripple will spawn from the cursor position.

Use of `HTMLElementButton` or `HTMLAnchorElement` is supported, but note that using interactive content descendents violates the HTML specifications. Therefore, some browsers may not apply interactive elements such as ripples.