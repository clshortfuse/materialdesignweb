# Syntax


## Standard
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" ")
  span.mdw-textfield__label Title
  .mdw-textfield__border-line
```

## Pre-filled
```
label.mdw-textfield
  input.mdw-textfield__input(value="Vintage 50" placeholder=" ")
  span.mdw-textfield__label Title
  .mdw-textfield__border-line
```

## Custom font size
```
label.mdw-textfield(style="font-size: 2.125rem")
  // Do not apply font changes to the input element
  input.mdw-textfield__input(placeholder=" ")
  span.mdw-textfield__label Title
  .mdw-textfield__border-line
```

## Helper Text
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" ")
  span.mdw-textfield__label Title
  .mdw-textfield__border-line
  .mdw-textfield__helper-text Helper Text
```

## Error Text
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" " required)
  span.mdw-textfield__label Title
  .mdw-textfield__border-line
  .mdw-textfield__error-text Helper Text
```

## Helper and Error Text
```
label.mdw-textfield
  input.mdw-textfield__input(placeholder=" " required)
  span.mdw-textfield__label Title
  .mdw-textfield__border-line
  .mdw-textfield__helper-text Helper Text
  .mdw-textfield__error-text Helper Text
```

## Prefixed text
```
label.mdw-textfield
  input.mdw-textfield__input(type="text" placeholder=" ")
  .mdw-textfield__label Amount
  .mdw-textfield__prefix $
  .mdw-textfield__border-line
```

## Suffixed text
```
label.mdw-textfield
  input.mdw-textfield__input(type="email" placeholder=" ")
  .mdw-textfield__label Email
  .mdw-textfield__suffix @gmail.com
  .mdw-textfield__border-line
```

## Icon
```
label.mdw-textfield
  .mdw-textfield__icon.material-icons person
  input.mdw-textfield__input(type="text" placeholder=" " value="Ali Connors")
  .mdw-textfield__label Name
  .mdw-textfield__border-line
```

## Accented
```
.mdw-textfield(mdw-color="accent")
  input.mdw-textfield__input(type="text" placeholder=" ")
  label.mdw-textfield__label Phone number
  .mdw-textfield__border-line
```

## Multiline

```
label.mdw-textfield
  textarea.mdw-textfield__input(placeholder=" ")
  span.mdw-textfield__label Description
  .mdw-textfield__border-line
```

## Multiline with Auto-Expand (requires-JS)

```
label.mdw-textfield
  textarea.mdw-textfield__input(placeholder=" " mdw-multiline)
  span.mdw-textfield__label Description
  .mdw-textfield__border-line
```

## Textarea

```
label.mdw-textfield(mdw-textarea)
  textarea.mdw-textfield__input(placeholder=" " rows="5")
  span.mdw-textfield__label Message
```

## Boxed
```
label.mdw-textfield(mdw-box)
  input.mdw-textfield__input(placeholder=" ")
  span.mdw-textfield__label Title
```

## Boxed Textarea
```
label.mdw-textfield(mdw-textarea mdw-box)
  textarea.mdw-textfield__input(placeholder=" " rows="5")
  span.mdw-textfield__label Title
```

# Notes

Use `rows` attribute to define minimum size of multiline or textarea fields. `.mdw-textfield__border-line` is not needed with textarea or boxed fields, but the element does not need to be removed since it is automatically hidden.

# Javascript

```
  document.querySelectorAll(".mdw-textfield").forEach((element) => {
    new TextField(element);
  });
```

# Notes

Detection as to whether the input value is filled is based on `:placeholder-shown`. The `placeholder` attribute needs to be present and not blank. Use an empty space (`placeholder=" "`) to appear blank instead of a blank or non-existant attribute.

As a fallback, browsers that don't support support `:placeholder-shown` will have their labels permanently floated above the input box. Initializing the element with Javascript will ensure the label acts according to spec.