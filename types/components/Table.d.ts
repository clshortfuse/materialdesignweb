declare const _default: typeof CustomElement & import("../core/CustomElement.js").Class<{
    caption: Element;
    tHead: Element;
    tFoot: Element;
    tBodies: HTMLCollectionOf<Element>;
    rows: HTMLCollectionOf<Element>;
}, any[]> & import("../core/CustomElement.js").Class<{
    /** Create and return a `mdw-caption` element, appending when necessary. */
    createCaption(): Element;
    /** Remove the table's caption element when present. */
    deleteCaption(): void;
    /** Create and return a `mdw-thead` element for the table. */
    createTHead(): Element;
    /** Remove the table's `mdw-thead` element when present. */
    deleteTHead(): void;
    /** Create and return a `mdw-tfoot` element for the table. */
    createTFoot(): Element;
    /** Remove the table's `mdw-tfoot` element when present. */
    deleteTFoot(): void;
    /** Insert and return a new `mdw-tbody` element before the tFoot (if any). */
    createTBody(): Element;
}, any[]>;
export default _default;
import CustomElement from '../core/CustomElement.js';
//# sourceMappingURL=Table.d.ts.map