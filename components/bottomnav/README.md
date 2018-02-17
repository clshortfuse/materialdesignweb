# Syntax


## Fixed (Primary Color)

```
form.mdw-bottomnav
  label.mdw-button.mdw-bottomnav__action
    input(type="radio" name="bottomnav" value="recents")
    .mdw-bottomnav__icon.material-icons history
    span.mdw-bottomnav__label Recents
  label.mdw-button.mdw-bottomnav__action
    input(type="radio" name="bottomnav" value="favorites" checked)
    .mdw-bottomnav__icon.material-icons favorite
    span.mdw-bottomnav__label Favorites
  label.mdw-button.mdw-bottomnav__action
    input(type="radio" name="bottomnav" value="nearby")
    .mdw-bottomnav__icon.material-icons near_me
    span.mdw-bottomnav__label Nearby
```

## Fixed (Filled)
```
form.mdw-bottomnav.mdw-theme__filled(mdw-color="primary" mdw-tone="700")
  label.mdw-button.mdw-bottomnav__action
    input(type="radio" name="bottomnav" value="recents")
    .mdw-bottomnav__icon.material-icons history
    span.mdw-bottomnav__label Recents
  label.mdw-button.mdw-bottomnav__action
    input(type="radio" name="bottomnav" value="favorites" checked)
    .mdw-bottomnav__icon.material-icons favorite
    span.mdw-bottomnav__label Favorites
  label.mdw-button.mdw-bottomnav__action
    input(type="radio" name="bottomnav" value="nearby")
    .mdw-bottomnav__icon.material-icons near_me
    span.mdw-bottomnav__label Nearby
```

## Shifting (Primary Color)
```
form.mdw-bottomnav(mdw-shifting)
  input(type="radio" name="shiftingbottomnav" value="movies" id='value1')
  label.mdw-button.mdw-bottomnav__action(for='value1')
    .mdw-bottomnav__icon.material-icons tv
    span.mdw-bottomnav__label Movies &amp; TV
  input(type="radio" name="shiftingbottomnav" value="music" id='value2' checked )
  label.mdw-button.mdw-bottomnav__action(for='value2')
    .mdw-bottomnav__icon.material-icons music_note
    span.mdw-bottomnav__label Music
  input(type="radio" name="shiftingbottomnav" value="books" id='value3')
  label.mdw-button.mdw-bottomnav__action(for='value3')
    .mdw-bottomnav__icon.material-icons book
    span.mdw-bottomnav__label Books
  input(type="radio" name="shiftingbottomnav" value="newsstand" id='value4')
  label.mdw-button.mdw-bottomnav__action(for='value4')
    .mdw-bottomnav__icon.material-icons assignment
    span.mdw-bottomnav__label Newsstand
```

## Shifting (Filled)
```
form.mdw-bottomnav.mdw-theme__filled(mdw-color="primary" mdw-tone="700" mdw-shifting)
  input(type="radio" name="shiftingbottomnav" value="movies" id='value1')
  label.mdw-button.mdw-bottomnav__action(for='value1')
    .mdw-bottomnav__icon.material-icons tv
    span.mdw-bottomnav__label Movies &amp; TV
  input(type="radio" name="shiftingbottomnav" value="music" id='value2' checked )
  label.mdw-button.mdw-bottomnav__action(for='value2')
    .mdw-bottomnav__icon.material-icons music_note
    span.mdw-bottomnav__label Music
  input(type="radio" name="shiftingbottomnav" value="books" id='value3')
  label.mdw-button.mdw-bottomnav__action(for='value3')
    .mdw-bottomnav__icon.material-icons book
    span.mdw-bottomnav__label Books
  input(type="radio" name="shiftingbottomnav" value="newsstand" id='value4')
  label.mdw-button.mdw-bottomnav__action(for='value4')
    .mdw-bottomnav__icon.material-icons assignment
    span.mdw-bottomnav__label Newsstand
```

# Notes

Shifting actions requires use of `input` elements *immediately* preceeding its corresponding the `.mdw-bottomnav__action` element.

See `.mdw-button` documentation for more information regardling ripple origins.