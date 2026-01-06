# Navigation

Navigation components organize app structure and flows. Use `mdw-root` slots for
app bars and side navigation.

## Navigation components

- App bars: `mdw-top-app-bar`, `mdw-bottom-app-bar`
- Navigation: `mdw-nav-bar`, `mdw-nav-drawer`, `mdw-nav-rail`
- Tabs: `mdw-tab`, `mdw-tab-list`, `mdw-tab-panel`, `mdw-tab-content`
- Menus & lists: `mdw-menu`, `mdw-list`, `mdw-listbox`

## Example

```html
<mdw-root>
  <mdw-page>
    <mdw-pane>
      <mdw-top-app-bar headline="App"></mdw-top-app-bar>
      <mdw-box padding=pane gap=16>
        <mdw-tab-list tab-content-id="tabs">
          <mdw-tab href="#overview">Overview</mdw-tab>
          <mdw-tab href="#activity">Activity</mdw-tab>
        </mdw-tab-list>
        <mdw-tab-content id="tabs">
          <mdw-tab-panel id="overview">Overview content</mdw-tab-panel>
          <mdw-tab-panel id="activity">Activity content</mdw-tab-panel>
        </mdw-tab-content>
      </mdw-box>
    </mdw-pane>
  </mdw-page>
</mdw-root>
```

## Related demos

- App bars: https://clshortfuse.github.io/materialdesignweb/components/topappbar.html
- Nav bar: https://clshortfuse.github.io/materialdesignweb/components/navbar.html
- Nav drawer: https://clshortfuse.github.io/materialdesignweb/components/navdrawer.html
- Nav rail: https://clshortfuse.github.io/materialdesignweb/components/navrail.html
- Tabs: https://clshortfuse.github.io/materialdesignweb/components/tabs.html
- Menus: https://clshortfuse.github.io/materialdesignweb/components/menus.html
- Lists: https://clshortfuse.github.io/materialdesignweb/components/list.html
