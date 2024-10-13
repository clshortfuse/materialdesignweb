/**
 * Clone attribute
 * @param {string} name
 * @param {string} target
 * @return {(oldValue:string, newValue:string, element: CustomElement) => void}
 */
export function cloneAttributeCallback(name: string, target: string): (oldValue: string, newValue: string, element: CustomElement) => void;
/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
    /** @type {string} */
    static elementName: string;
    /** @return {Iterable<string>} */
    static get observedAttributes(): Iterable<string>;
    /** @type {Composition<?>} */
    static _composition: Composition<unknown>;
    /** @type {Map<string, import('./observe.js').ObserverConfiguration<?,?,?>>} */
    static _props: Map<string, import("./observe.js").ObserverConfiguration<unknown, unknown, unknown>>;
    /** @type {Map<string, import('./observe.js').ObserverConfiguration<?,?,?>>} */
    static _attrs: Map<string, import("./observe.js").ObserverConfiguration<unknown, unknown, unknown>>;
    /** @type {Map<string, Function[]>} */
    static _propChangedCallbacks: Map<string, Function[]>;
    /** @type {Map<string, Function[]>} */
    static _attributeChangedCallbacks: Map<string, Function[]>;
    /** @type {((callback: CallbackArguments) => any)[]} */
    static _onComposeCallbacks: ((callback: CallbackArguments) => any)[];
    /** @type {((callback: CallbackArguments) => any)[]} */
    static _onConnectedCallbacks: ((callback: CallbackArguments) => any)[];
    /** @type {((callback: CallbackArguments) => any)[]} */
    static _onDisconnectedCallbacks: ((callback: CallbackArguments) => any)[];
    /** @type {((callback: CallbackArguments) => any)[]} */
    static _onConstructedCallbacks: ((callback: CallbackArguments) => any)[];
    static interpolatesTemplate: boolean;
    static supportsElementInternals: boolean;
    static supportsElementInternalsRole: boolean;
    /** @type {boolean} */
    static templatable: boolean;
    static defined: boolean;
    static autoRegistration: boolean;
    /** @type {Map<string, typeof CustomElement>} */
    static registrations: Map<string, typeof CustomElement>;
    /**
     * Expressions are idempotent functions that are selectively called whenever
     * a render is requested.
     * Expressions are constructed exactly as methods though differ in expected
     * arguments. The first argument should be destructured to ensure each used
     * property is accessed at least once in order to inspect used properties.
     *
     * The Composition API will inspect this function with a proxy for `this` to
     * catalog what observables are used by the expression. This allows the
     * Composition API to build a cache as well as selective invoke the expression
     * only when needed.
     *
     * When used with in element templates, the element itself will be passed as
     * its first argument.
     * ````js
     *    Button
     *      .prop('filled', 'boolean')
     *      .prop('outlined', 'boolean')
     *      .expresssions({
     *        _isFilledOrOutlined({filled, outlined}) {
     *          return (filled || outlined)
     *        },
     *      })
     *      .html`<div custom={_isFilledOrOutlined}></div>`;
     * ````
     *
     * When used with external data source, that data source
     * will be passed to the expression with all properties being `null` at first
     * inspection.
     * ````js
     *    const externalData = {first: 'John', last: 'Doe'};
     *    ContactCard
     *      .expresssions({
     *        _fullName({first, last}) {
     *          return [first, last].filter(Boolean).join(' ');
     *        },
     *      })
     *   myButton.render(externalData);
     * ````
     *
     * Expressions may be support argumentless calls by using default
     * parameters with `this`.
     * ````js
     *    Button
     *      .expresssions({
     *        isFilledOrOutlined({filled, outlined} = this) {
     *          return (filled || outlined)
     *        },
     *      });
     *    myButton.isFilledorOutlined();
     * ````
     * @type {{
     * <
     *  CLASS extends typeof CustomElement,
     *  ARGS extends ConstructorParameters<CLASS>,
     *  INSTANCE extends InstanceType<CLASS>,
     *  PROPS extends {
     *    [K in keyof any]: K extends `_${any}` ? ((data: INSTANCE, state?: Record<string, any>) => string|boolean|null)
     *      : ((data?: INSTANCE, state?: Record<string, any>) => string|boolean|null)
     *  } & ThisType<INSTANCE>
     *  >(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>):
     *  CLASS & Class<{
     *    [K in keyof PROPS]: K extends `_${any}` ? never : () =>  ReturnType<PROPS[K]> }
     *    ,ARGS>
     * }}
     */
    static expressions: {
        <CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends { [K in keyof any]: K extends `_${any}` ? ((data: INSTANCE, state?: Record<string, any>) => string | boolean | null) : ((data?: INSTANCE, state?: Record<string, any>) => string | boolean | null); } & ThisType<INSTANCE>>(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>): CLASS & Class<{ [K in keyof PROPS]: K extends `_${any}` ? never : () => ReturnType<PROPS[K]>; }, ARGS>;
    };
    static methods: typeof CustomElement.set;
    /**
     * @type {{
     * <
     * CLASS extends typeof CustomElement,
     * ARGS extends ConstructorParameters<CLASS>,
     * INSTANCE extends InstanceType<CLASS>,
     * PROPS extends Partial<INSTANCE>>
     * (this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>)
     * : CLASS & Class<PROPS,ARGS>
     * }}
     */
    static overrides: {
        <CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends Partial<INSTANCE>>(this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>): CLASS & Class<PROPS, ARGS>;
    };
    /**
     * @type {{
     * <
     *  CLASS extends typeof CustomElement,
     *  ARGS extends ConstructorParameters<CLASS>,
     *  INSTANCE extends InstanceType<CLASS>,
     *  KEY extends string,
     *  OPTIONS extends ObserverPropertyType
     *    | ObserverOptions<ObserverPropertyType, unknown, INSTANCE>
     *    | ((this:INSTANCE, data:Partial<INSTANCE>, fn?: () => any) => any),
     *  VALUE extends Record<KEY, OPTIONS extends (...args2:any[]) => infer R ? R
     *      : OPTIONS extends ObserverPropertyType ? import('./observe.js').ParsedObserverPropertyType<OPTIONS>
     *      : OPTIONS extends {type: 'object'} & ObserverOptions<any, infer R> ? (unknown extends R ? object : R)
     *      : OPTIONS extends {type: ObserverPropertyType} ? import('./observe.js').ParsedObserverPropertyType<OPTIONS['type']>
     *      : OPTIONS extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R)
     *      : never
     *      >
     *  > (this: CLASS, name: KEY, options: OPTIONS)
     *    : CLASS & Class<VALUE,ARGS>;
     * }}
     */
    static props: {
        <CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, KEY extends string, OPTIONS extends ObserverPropertyType | ObserverOptions<ObserverPropertyType, unknown, INSTANCE> | ((this: INSTANCE, data: Partial<INSTANCE>, fn?: () => any) => any), VALUE extends Record<KEY, OPTIONS extends (...args2: any[]) => infer R ? R : OPTIONS extends ObserverPropertyType ? import("./observe.js").ParsedObserverPropertyType<OPTIONS> : OPTIONS extends {
            type: "object";
        } & ObserverOptions<any, infer R> ? (unknown extends R ? object : R) : OPTIONS extends {
            type: ObserverPropertyType;
        } ? import("./observe.js").ParsedObserverPropertyType<OPTIONS["type"]> : OPTIONS extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R) : never>>(this: CLASS, name: KEY, options: OPTIONS): CLASS & Class<VALUE, ARGS>;
    };
    static idl: typeof CustomElement.prop;
    /**
     * @this T
     * @template {typeof CustomElement} T
     * @template {keyof T} K
     * @param {K} collection
     * @param {T[K] extends (infer R)[] ? R : never} callback
     */
    static _addCallback<T extends typeof CustomElement, K extends keyof T>(this: T, collection: K, callback: T[K] extends (infer R)[] ? R : never): void;
    static append<T extends typeof CustomElement>(this: T, ...parts: ConstructorParameters<typeof Composition<InstanceType<T>>>): T;
    static recompose<T1 extends typeof CustomElement, T2 extends InstanceType<T1>, T3 extends CompositionCallback<T2, T2>["composed"]>(this: T1, callback: T3): T1;
    static css<T1 extends typeof CustomElement, T2 extends TemplateStringsArray | HTMLStyleElement | CSSStyleSheet | string>(this: T1, array: T2, ...rest: T2 extends string ? any : T2 extends TemplateStringsArray ? any[] : (HTMLStyleElement | CSSStyleSheet)[]): T1;
    static autoRegister<T extends typeof CustomElement>(this: T, elementName: string): T;
    static html<T extends typeof CustomElement>(this: T, string: TemplateStringsArray, ...substitutions: (string | Element | ((this: InstanceType<T>, data: InstanceType<T>, injections?: any) => any))[]): T;
    static extend<T1 extends typeof CustomElement, T2 extends T1, T3 extends (Base: T1) => T2>(this: T1, customExtender?: T3 | null): T3 extends null ? T1 : T2;
    static setStatic<T1 extends typeof CustomElement, T2 extends { [K in keyof any]: (((this: T1, ...args: any[]) => any) | string | number | boolean | any[] | object); }>(this: T1, source: T2 & ThisType<T1 & T2>): T1 & T2;
    static readonly<CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends object>(this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>): CLASS & Class<PROPS, ARGS>;
    static set<CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends object>(this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>): CLASS & Class<PROPS, ARGS>;
    static mixin<BASE extends typeof CustomElement, FN extends (...args: any[]) => any, RETURN extends ReturnType<FN>, SUBCLASS extends ClassOf<RETURN>>(this: BASE, mixin: FN): SUBCLASS & BASE;
    static register<T extends typeof CustomElement>(this: T, elementName?: string, force?: boolean): T;
    static get propList(): Map<string, import("./observe.js").ObserverConfiguration<any, any, any, any>>;
    static get attrList(): Map<string, import("./observe.js").ObserverConfiguration<any, any, any, any>>;
    static get propChangedCallbacks(): Map<string, Function[]>;
    static get attributeChangedCallbacks(): Map<string, Function[]>;
    static prop<CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, KEY extends string, OPTIONS extends ObserverPropertyType | ObserverOptions<ObserverPropertyType, unknown, INSTANCE> | ((this: INSTANCE, data: Partial<INSTANCE>, fn?: () => any) => any), VALUE extends Record<KEY, OPTIONS extends (...args2: any[]) => infer R ? R : OPTIONS extends ObserverPropertyType ? import("./observe").ParsedObserverPropertyType<OPTIONS> : OPTIONS extends {
        type: "object";
    } & ObserverOptions<any, infer R> ? (unknown extends R ? object : R) : OPTIONS extends {
        type: ObserverPropertyType;
    } ? import("./observe").ParsedObserverPropertyType<OPTIONS["type"]> : OPTIONS extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R) : never>>(this: CLASS, name: KEY, options: OPTIONS): CLASS & Class<VALUE, ARGS>;
    static define<CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends { [P in keyof any]: {
        enumerable?: boolean;
        configurable?: boolean;
        writable?: boolean;
        value?: any;
        get?: ((this: INSTANCE) => any);
        set?: (this: INSTANCE, value: any) => void;
    } | ((this: INSTANCE, ...args: any[]) => any); }, VALUE extends { [KEY in keyof PROPS]: PROPS[KEY] extends (...args2: any[]) => infer R ? R : PROPS[KEY] extends TypedPropertyDescriptor<infer R> ? R : never; }>(this: CLASS, props: PROPS & ThisType<PROPS & INSTANCE>): CLASS & Class<VALUE, ARGS>;
    static undefine(name: any): typeof CustomElement;
    static observe<CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends IDLParameter<INSTANCE & VALUE>, VALUE extends { [KEY in keyof PROPS]: PROPS[KEY] extends (...args2: any[]) => infer R ? R : PROPS[KEY] extends ObserverPropertyType ? import("./observe").ParsedObserverPropertyType<PROPS[KEY]> : PROPS[KEY] extends {
        type: "object";
    } & ObserverOptions<any, infer R> ? (unknown extends R ? object : R) : PROPS[KEY] extends {
        type: ObserverPropertyType;
    } ? import("./observe").ParsedObserverPropertyType<PROPS[KEY]["type"]> : PROPS[KEY] extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R) : never; }>(this: CLASS, props: PROPS): CLASS & Class<VALUE, ARGS>;
    static defineStatic<T1 extends typeof CustomElement, T2 extends IDLParameter<T1>>(this: T1, props: T2): T1 & ParsedProps<T2>;
    static events<T extends typeof CustomElement>(this: T, listeners?: import("./Composition").CompositionEventListenerObject<InstanceType<T>>, options?: Partial<import("./Composition").CompositionEventListener<InstanceType<T>>>): T;
    static childEvents<T extends typeof CustomElement>(this: T, listenerMap: { [P in keyof any]: import("./Composition").CompositionEventListenerObject<InstanceType<T>>; }, options?: Partial<import("./Composition").CompositionEventListener<InstanceType<T>>>): T;
    static rootEvents<T extends typeof CustomElement>(this: T, listeners?: import("./Composition").CompositionEventListenerObject<InstanceType<T>>, options?: Partial<import("./Composition").CompositionEventListener<InstanceType<T>>>): T;
    static on<T1 extends typeof CustomElement, T2 extends InstanceType<T1>, T3 extends CompositionCallback<T2, T2>, T4 extends keyof T3>(this: T1, name: T3 | T4, callbacks?: T3[T4] & ThisType<T2>): T1;
    static onPropChanged<T1 extends typeof CustomElement, T2 extends InstanceType<T1>>(this: T1, options: ObjectOrObjectEntries<{ [P in keyof T2]?: (this: T2, oldValue: T2[P], newValue: T2[P], changes: any, element: T2) => void; }>): T1;
    static onAttributeChanged<T1 extends typeof CustomElement, T2 extends InstanceType<T1>>(this: T1, options: {
        [x: string]: (this: T2, oldValue: string, newValue: string, element: T2) => void;
    }): T1;
    /** @param {any[]} args */
    constructor(...args: any[]);
    compose(parts: (import("./Composition.js").CompositionPart<any>)[]): Composition<any>;
    /** @type {Map<string,{stringValue:string, parsedValue:any}>} */
    _propAttributeCache: Map<string, {
        stringValue: string;
        parsedValue: any;
    }>;
    /** @type {CallbackArguments} */
    _callbackArguments: CallbackArguments;
    elementInternals: ElementInternals;
    /**
     * Updates nodes based on data
     * Expects data in JSON Merge Patch format
     * @see https://www.rfc-editor.org/rfc/rfc7386
     * @param {Partial<?>} changes
     * @param {any} data
     * @return {void}
     */
    render: Function & {
        target: Element;
    };
    propChangedCallback<T extends CustomElement, K extends string = string>(this: T, name: K, oldValue: K extends keyof T ? T[K] : unknown, newValue: K extends keyof T ? T[K] : unknown, changes?: K extends keyof T ? T[K] extends object ? Partial<T[K]> : T[K] : unknown): void;
    /**
     * @param {string} name
     * @param {string|null} oldValue
     * @param {string|null} newValue
     */
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * @param {string} name
     * @param {any} oldValue
     * @param {any} newValue
     * @param {any} changes
     */
    _onObserverPropertyChanged(name: string, oldValue: any, newValue: any, changes: any): void;
    patch(patch: any): void;
    patching: boolean;
    /**
     * Proxy object that returns shadow DOM elements by tag.
     * If called before interpolation (eg: on composed), returns from template
     * @return {Record<string,HTMLElement>}
     */
    get refs(): Record<string, HTMLElement>;
    get attributeCache(): Map<any, any>;
    get static(): typeof CustomElement;
    get unique(): boolean;
    get callbackArguments(): CallbackArguments<any, any> | {
        composition: Composition<any>;
        refs: Record<string, HTMLElement>;
        html: any;
        inline: typeof addInlineFunction;
        template: DocumentFragment;
        element: this;
    };
    /** @return {Composition<?>} */
    get composition(): Composition<any>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    delegatesFocus: boolean;
    #private;
}
export type ObserverPropertyType = import("./observe.js").ObserverPropertyType;
export type ParsedProps<T extends unknown> = { [P in keyof T]: T[P] extends (...args: any[]) => infer T2 ? T2 : T[P] extends ObserverPropertyType ? import("./observe.js").ParsedObserverPropertyType<T[P]> : T[P] extends {
    type: ObserverPropertyType;
} ? import("./observe.js").ParsedObserverPropertyType<T[P]["type"]> : T[P] extends ObserverOptions<null, infer T2> ? unknown extends T2 ? string : T2 : never; };
export type ObserverOptions<T1 extends ObserverPropertyType, T2 extends unknown, C extends Object = any> = import("./observe.js").ObserverOptions<T1, T2, C>;
/**
 * <T>
 */
export type ClassOf<T extends {
    prototype: unknown;
}> = T;
export type Class<T extends unknown = any, A extends any[] = any[]> = abstract new (...args: A) => T;
export type HTMLTemplater<T1 extends unknown, T2 extends unknown = T1> = (string: TemplateStringsArray, ...substitutions: (string | DocumentFragment | Element | ((this: T1, data: T2) => any))[]) => DocumentFragment;
export type CallbackArguments<T1 extends unknown = any, T2 extends unknown = T1> = {
    composition: Composition<T1>;
    refs: Record<string, HTMLElement>;
    html: HTMLTemplater<T1, Partial<T2>>;
    inline: (fn: (this: T1, data: T2) => any) => string;
    template: DocumentFragment;
    element: T1;
};
export type CompositionCallback<T1 extends unknown, T2 extends unknown = T1> = {
    composed?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    constructed?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    connected?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    disconnected?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    props?: { [P in keyof T1]: (this: T1, oldValue: T1[P], newValue: T1[P], changes: any, element: T1) => any; };
    attrs?: { [K in keyof any]: (this: T1, oldValue: string, newValue: string, element: T1) => unknown; };
} & { [P in keyof T1 & string as `${P}Changed`]?: (this: T1, oldValue: T1[P], newValue: T1[P], changes: any, element: T1) => any; };
export type IDLParameter<C extends Object> = { [P in string]: ObserverPropertyType | ObserverOptions<ObserverPropertyType, unknown, C> | ((this: C, data: Partial<C>, fn?: () => any) => any); };
export type ObjectOrObjectEntries<T> = (T | Array<[keyof T & string, T[keyof T]]>);
import Composition from './Composition.js';
import { addInlineFunction } from './template.js';
//# sourceMappingURL=CustomElement.d.ts.map