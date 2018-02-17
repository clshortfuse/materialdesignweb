# Syntax


## Bare Minimum
```
label.mdw-text-field
  input.mdw-text-field__input(placeholder=" ")
  span.mdw-text-field__label Title
  .mdw-text-field__border-line
```

## Pre-filled
```
label.mdw-text-field
  input.mdw-text-field__input(value="Vintage 50" placeholder=" ")
  span.mdw-text-field__label Title
  .mdw-text-field__border-line
```
## Helper Text
```
label.mdw-text-field
  input.mdw-text-field__input(placeholder=" ")
  span.mdw-text-field__label Title
  .mdw-text-field__border-line
  .mdw-text-field__helper-text Helper Text
```

## Error Text
```
label.mdw-text-field
  input.mdw-text-field__input(placeholder=" " required)
  span.mdw-text-field__label Title
  .mdw-text-field__border-line
  .mdw-text-field__error-text Helper Text
```

## Helper and Error Text
```
label.mdw-text-field
  input.mdw-text-field__input(placeholder=" " required)
  span.mdw-text-field__label Title
  .mdw-text-field__border-line
  .mdw-text-field__helper-text Helper Text
  .mdw-text-field__error-text Helper Text
```

## Accented

```
.mdw-text-field(mdw-color="accent")
  input.mdw-text-field__input(type="text" placeholder=" ")
  label.mdw-text-field__label Phone number
  .mdw-text-field__border-line
```

## Multiline

```
label.mdw-text-field
  textarea.mdw-text-field__input(placeholder=" ")
  span.mdw-text-field__label Description
  .mdw-text-field__border-line
```

## Multiline with Auto-Expand (requires-JS)

Pug/HTML:

```
label.mdw-text-field
  textarea.mdw-text-field__input(placeholder=" " mdw-multiline)
  span.mdw-text-field__label Description
  .mdw-text-field__border-line
```

## Textarea

```
label.mdw-text-field(mdw-textarea)
  textarea.mdw-text-field__input(placeholder=" " rows="5")
  span.mdw-text-field__label Message
```

Use rows to define size. `.mdw-text-field__border-line` is not needed, but can be safely kept because it's hidden when inside a textarea.

# Javascript

JS:
```
  document.querySelectorAll(".mdw-text-field").forEach((element) => {
    new TextField(element);
  });
```

# Notes

Detection as to whether the input value is filled is based on `:placeholder-shown`. The `placeholder` attribute needs to be present and not blank. Use an empty space (`placeholder=" "`) to appear blank instead of a blank or non-existant attribute.

As a fallback, browsers that don't support support `:placeholder-shown` will have their labels permanently floated above the input box. Initializing the element with Javascript will ensure the label acts according to spec.