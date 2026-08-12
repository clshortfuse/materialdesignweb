# Navigation

Navigation components organize app structure and flows. Use `mdw-root` slots for
app bars and side navigation.

## Navigation components

- App bars: `mdw-top-app-bar`, `mdw-bottom-app-bar`
- Navigation: `mdw-nav-bar`, `mdw-nav-drawer`, `mdw-nav-rail`
- Drawer organization: `mdw-nav-drawer`, `mdw-nav-drawer-section`
- Tabs: `mdw-tab`, `mdw-tab-list`, `mdw-tab-panel`, `mdw-tab-content`
- Menus & lists: `mdw-menu`, `mdw-list`, `mdw-list-tree`, `mdw-listbox`

## List trees

Use `mdw-list-tree` for hierarchical list items. Nested branches use another
`mdw-list-tree` assigned to the parent item's `expansion` slot. The first direct
expansion tree is an owned `group`. A ListTree outside that expansion topology is
an independent tree owner. The framework derives all ARIA roles from this HTML
structure. Only an item with that owned expansion tree is exposed and activated
as a collapsible tree branch; other expansion content does not acquire tree
disclosure semantics.

```html
<mdw-list-tree>
  <mdw-list-item expanded>
    Parent
    <mdw-list-tree slot="expansion">
      <mdw-list-item>Child</mdw-list-item>
    </mdw-list-tree>
  </mdw-list-item>
</mdw-list-tree>
```

Use `mdw-list` for a non-hierarchical list. Use `mdw-list-tree` when disclosure
keyboard behavior and hierarchical ownership are required.

## Navigation drawer sections

Use `headline` or `slot="headline"` to label the drawer. Use drawer sections to
group related destinations. Add `divider` to render the recommended divider
before a section, and use `label` or `slot="label"` for visible group labels.

```html
<mdw-nav-drawer headline="Mail">
  <mdw-nav-drawer-section>
    <mdw-nav-drawer-item icon="inbox" active badge="24">Inbox</mdw-nav-drawer-item>
    <mdw-nav-drawer-item icon="send">Outbox</mdw-nav-drawer-item>
  </mdw-nav-drawer-section>
  <mdw-nav-drawer-section divider label="Labels">
    <mdw-nav-drawer-item icon="folder">Label</mdw-nav-drawer-item>
  </mdw-nav-drawer-section>
</mdw-nav-drawer>
```

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
