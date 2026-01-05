# Feedback & Overlays

Use feedback components for progress, confirmations, and transient UI.

## Components

- `mdw-dialog`
- `mdw-snackbar`
- `mdw-progress`
- `mdw-tooltip`
- `mdw-badge`
- `mdw-bottom-sheet`
- `mdw-side-sheet`
- `mdw-popup`
- `mdw-scrim`

## Example

```html
<mdw-dialog id="confirm">
  <mdw-title slot=header>Confirm</mdw-title>
  <mdw-body>Delete this item?</mdw-body>
  <mdw-dialog-actions slot=footer>
    <mdw-button outlined>Cancel</mdw-button>
    <mdw-button filled>Delete</mdw-button>
  </mdw-dialog-actions>
</mdw-dialog>
```

## Related demos

- Dialogs: https://clshortfuse.github.io/materialdesignweb/components/dialogs.html
- Snackbar: https://clshortfuse.github.io/materialdesignweb/components/snackbar.html
- Progress: https://clshortfuse.github.io/materialdesignweb/components/progress.html
- Tooltip: https://clshortfuse.github.io/materialdesignweb/components/tooltip.html
- Badge: https://clshortfuse.github.io/materialdesignweb/components/badge.html
- Bottom sheet: https://clshortfuse.github.io/materialdesignweb/components/bottomsheet.html
