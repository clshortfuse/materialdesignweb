import './ListCell.js';

import ListItem from './ListItem.js';

/** A statically identified row within an `mdw-list-grid`. */
export default ListItem
  .extend()
  .set({
    _ariaRole: 'row',
    _primaryCellDisclosure: false,
  })
  .expressions({
    isInteractive({ actionable, href }) {
      return actionable || href != null;
    },
    _showStateLayer({ actionable, href, stateLayer }) {
      return stateLayer && (actionable || href != null);
    },
    _showRippleContainer({ actionable, disabledState, href }) {
      return !disabledState && (actionable || href != null);
    },
    _showExpansionAction({ _expandable, href }) {
      return _expandable && href == null;
    },
    _showExpandableIcon() {
      return false;
    },
  })
  .recompose(({ refs: { primaryCell, expansionCell } }) => {
    primaryCell.setAttribute('role', 'gridcell');
    expansionCell.setAttribute('role', 'gridcell');
  })
  .autoRegister('mdw-list-row');
