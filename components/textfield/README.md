# Syntax


## Standard
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
```

## Pre-filled
```
label.mdw-textfield
  input.mdw-textfield__input(value="Vintage 50" placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
```

## Custom font size
```
label.mdw-textfield(style="font-size: 2.125rem")
  // Do not apply font changes to the input element
  input.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
```

## Helper Text
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
  .mdw-textfield__helper-text Helper Text
```

## Error Text
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" " required)
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
  .mdw-textfield__error-text Helper Text
```

## Helper and Error Text
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" " required)
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
  .mdw-textfield__helper-text Helper Text
  .mdw-textfield__error-text Helper Text
```

## Prefixed text
```
label.mdw-textfield
  input.mdw-textfield__input(type="text" placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Amount
  .mdw-textfield__prefix $
```

## Suffixed text
```
label.mdw-textfield
  input.mdw-textfield__input(type="email" placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Email
  .mdw-textfield__suffix @gmail.com
```

## Icon
```
label.mdw-textfield
  input.mdw-textfield__input(type="text" placeholder=" " value="Ali Connors")
  .mdw-textfield__icon.material-icons person
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Name
```

## Secondary Color
```
label.mdw-textfield.mdw-theme(mdw-ink="secondary")
  input.mdw-textfield__input(type="text" placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Phone number
```

## Multiline

```
label.mdw-textfield
  textarea.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Description
```

## Mutiline with row count

```
label.mdw-textfield(mdw-autosize)
  textarea.mdw-textfield__input(placeholder=" " rows="5")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Message
```

## Solo
```
label.mdw-textfield(mdw-solo)
  input.mdw-textfield__input(placeholder=" ")
```

## Outlined
```
label.mdw-textfield(mdw-outlined)
  input.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
```

## Outlined Multiline
```
label.mdw-textfield
  textarea.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Title
```

## Multiline with Auto-Size (requires-JS)
```
label.mdw-textfield(mdw-autosize)
  textarea.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Description
```


## Outlined Multiline with Auto-Size (requires-JS)
```
label.mdw-textfield(mdw-autosize mdw-outlined)
  textarea.mdw-textfield__input(placeholder=" ")
  .mdw-textfield__border
    .mdw-textfield__outline-gap
      .mdw-textfield__label Description
```

# Javascript

```
  document.getElementsByClassName("mdw-textfield").forEach((element) => {
    TextField.attach(element);
  });
```

# Notes

Use `rows` attribute to define minimum size of multiline or textarea fields. 

`.mdw-textfield__outline-gap` is **always** needed.

Detection as to whether the input value is filled is based on `:placeholder-shown`. The `placeholder` attribute needs to be present and not blank. Use an empty space (`placeholder=" "`) to appear blank instead of a blank or non-existant attribute. As a fallback, browsers that don't support support `:placeholder-shown` will have their labels permanently floated above the input box. Initializing the element with Javascript will ensure the label acts according to spec.