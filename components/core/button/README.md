# Syntax


## Flat
```
button.mdw-button
```

## Raised
```
button.mdw-button(mdw-raised)
```

## Always Raised
```
button.mdw-button(mdw-raised="always")
```

## Colored
```
button.mdw-button(mdw-theme-color="primary")
```

## Colored (Custom Tone)
```
button.mdw-button(mdw-theme-color="accent-A100")
```

## Filled
```
button.mdw-button(mdw-theme-fill="primary")
```

## Filled (Custom Tone)
```
button.mdw-button(mdw-theme-fill="accent-A400")
```

## Filled (Custom Tone)
```
button.mdw-button(disabled)
```

## Icon Button

```
button.mdw-button(mdw-icon).material-icons favorite
```

# Javascript

```
  document.querySelectorAll(".mdw-button").forEach((element) => {
    new mdw.Button(element);
  });
```

# Notes

The click ripple aftereffect is centered when using keyboard or when using only CSS. Initializing the element with Javascript will ensure the ripple will spawn from the cursor position.