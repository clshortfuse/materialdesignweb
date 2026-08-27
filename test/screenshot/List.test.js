import '../../loaders/theme.js';
import List from '../../components/List.js';
import ListCell from '../../components/ListCell.js';
import ListGrid from '../../components/ListGrid.js';
import ListItem from '../../components/ListItem.js';
import ListRow from '../../components/ListRow.js';
import Ripple from '../../components/Ripple.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

disableAnimations(List, ListCell, ListGrid, ListItem, ListRow, Ripple);
await addRobotoFont();

beforeEach(() => document.body.replaceChildren());

describe('list hover feedback', () => {
  generateScreenshotTests({
    template: `
      <mdw-list color=surface style="inline-size:320px">
        <mdw-list-item actionable supporting="Supporting text"
          style="--mdw-state__hovered-opacity:0.5">Ordinary item</mdw-list-item>
      </mdw-list>
    `,
    matrix: [{ ordinary__hovered: { ':hover': true } }],
  });

  generateScreenshotTests({
    template: `
      <mdw-list-grid color=surface style="inline-size:320px">
        <mdw-list-row actionable supporting="Supporting text"
          style="--mdw-state__hovered-opacity:0.5">
          Grid row
          <mdw-list-cell slot=trailing-action>
            <button style="border:0;background:transparent;color:inherit;padding:0 16px">More</button>
          </mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `,
    matrix: [{ list_grid__hovered: { ':hover': true } }],
  });

  generateScreenshotTests({
    template: `
      <mdw-list-grid color=surface style="inline-size:320px">
        <mdw-list-row actionable supporting="Supporting text"
          style="--mdw-state__hovered-opacity:0.5">
          Sub-action hover
          <mdw-list-cell slot=trailing-action>
            <button style="border:0;background:transparent;color:inherit;inline-size:200px">More</button>
          </mdw-list-cell>
        </mdw-list-row>
      </mdw-list-grid>
    `,
    matrix: [{ list_grid_trailing__hovered: { ':hover': true } }],
  });
});
