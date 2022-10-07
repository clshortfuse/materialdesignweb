import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  static elementName = 'mdw-nav-rail';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <slot id=start name=start></slot>
      <div id=group></div>
    `,
  ];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('group').append(
      fragment.getElementById('slot'),
    );
    return fragment;
  }
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idlString('align'));

NavRail.prototype.refs = {
  ...Nav.prototype.refs,
  ...NavRail.addRefs({
    start: 'slot',
    group: 'div',
  }),
};
