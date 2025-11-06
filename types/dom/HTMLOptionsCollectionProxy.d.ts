/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#htmloptionscollection
 * @template {HTMLOptionElement} T1
 * @template {HTMLOptGroupElement} T2
 * @param {Object} options
 * @param {HTMLElement} options.host
 * @param {HTMLCollectionOf<T1>} options.collection
 * @param {new (...args: any[]) => T1} options.OptionConstructor
 * @param {new (...args: any[]) => T2} options.GroupConstructor
 * @return {HTMLCollectionOf<T1> & HTMLOptionsCollection}
 */
export function constructHTMLOptionsCollectionProxy<T1 extends HTMLOptionElement, T2 extends HTMLOptGroupElement>({ host, collection, OptionConstructor, GroupConstructor }: {
    host: HTMLElement;
    collection: HTMLCollectionOf<T1>;
    OptionConstructor: new (...args: any[]) => T1;
    GroupConstructor: new (...args: any[]) => T2;
}): HTMLCollectionOf<T1> & HTMLOptionsCollection;
//# sourceMappingURL=HTMLOptionsCollectionProxy.d.ts.map