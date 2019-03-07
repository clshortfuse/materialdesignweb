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
.mdw-button.mdw-theme(mdw-color="primary")
```

## Colored (Custom Tone)
```
.mdw-button.mdw-theme(mdw-color="accent A100")
```

## Filled
```
.mdw-button.mdw-theme(mdw-fill="primary")
```

## Filled (Custom Tone)
```
.mdw-button.mdw-theme(mdw-fill="accent A400")
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