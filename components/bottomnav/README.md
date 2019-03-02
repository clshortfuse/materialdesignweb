# Syntax


## Fixed (Primary Color)

```
form.mdw-bottomnav(mdw-theme-color="primary")
  label.mdw-bottomnav__item
    input.mdw-bottomnav__input(type="radio" name="bottomnav" value="recents")
    .mdw-bottomnav__icon.material-icons history
    .mdw-bottomnav__label Recents
  label.mdw-bottomnav__item
    input.mdw-bottomnav__input(type="radio" name="bottomnav" value="favorites" checked)
    .mdw-bottomnav__icon.material-icons favorite
    .mdw-bottomnav__label Favorites
  label.mdw-bottomnav__item
    input.mdw-bottomnav__input(type="radio" name="bottomnav" value="nearby")
    .mdw-bottomnav__icon.material-icons near_me
    .mdw-bottomnav__label Nearby
```

## Fixed (Filled)
```
form.mdw-bottomnav(mdw-theme-fill="primary 700")
  label.mdw-bottomnav__item
    input.mdw-bottomnav__input(type="radio" name="bottomnav" value="recents")
    .mdw-bottomnav__icon.material-icons history
    .mdw-bottomnav__label Recents
  label.mdw-bottomnav__item
    input.mdw-bottomnav__input(type="radio" name="bottomnav" value="favorites" checked)
    .mdw-bottomnav__icon.material-icons favorite
    .mdw-bottomnav__label Favorites
  label.mdw-bottomnav__item
    input.mdw-bottomnav__input(type="radio" name="bottomnav" value="nearby")
    .mdw-bottomnav__icon.material-icons near_me
    .mdw-bottomnav__label Nearby
```

## Shifting (Primary Color)
```
form.mdw-bottomnav(mdw-theme-color="primary" mdw-shifting)
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="movies" id='value1')
  label.mdw-bottomnav__item(for='value1')
    .mdw-bottomnav__icon.material-icons tv
    .mdw-bottomnav__label Movies &amp; TV
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="music" id='value2' checked )
  label.mdw-bottomnav__item(for='value2')
    .mdw-bottomnav__icon.material-icons music_note
    .mdw-bottomnav__label Music
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="books" id='value3')
  label.mdw-bottomnav__item(for='value3')
    .mdw-bottomnav__icon.material-icons book
    .mdw-bottomnav__label Books
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="newsstand" id='value4')
  label.mdw-bottomnav__item(for='value4')
    .mdw-bottomnav__icon.material-icons assignment
    .mdw-bottomnav__label Newsstand
```

## Shifting (Filled)
```
form.mdw-bottomnav(mdw-theme-fill="primary 700" mdw-shifting)
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="movies" id='value1')
  label.mdw-bottomnav__item(for='value1')
    .mdw-bottomnav__icon.material-icons tv
    .mdw-bottomnav__label Movies &amp; TV
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="music" id='value2' checked )
  label.mdw-bottomnav__item(for='value2')
    .mdw-bottomnav__icon.material-icons music_note
    .mdw-bottomnav__label Music
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="books" id='value3')
  label.mdw-bottomnav__item(for='value3')
    .mdw-bottomnav__icon.material-icons book
    .mdw-bottomnav__label Books
  input.mdw-bottomnav__input(type="radio" name="shiftingbottomnav" value="newsstand" id='value4')
  label.mdw-bottomnav__item(for='value4')
    .mdw-bottomnav__icon.material-icons assignment
    .mdw-bottomnav__label Newsstand
```

# Notes

Shifting items requires use of `input` elements *immediately* preceeding its corresponding the `.mdw-bottomnav__item` element.

See `.mdw-button` documentation for more information regardling ripple origins.