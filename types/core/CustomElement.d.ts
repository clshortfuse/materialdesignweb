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
    static _props: Map<string, import('./observe.js').ObserverConfiguration<unknown, unknown, unknown>>;
    /** @type {Map<string, import('./observe.js').ObserverConfiguration<?,?,?>>} */
    static _attrs: Map<string, import('./observe.js').ObserverConfiguration<unknown, unknown, unknown>>;
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
     *    [K in keyof any]: ((data?: INSTANCE, state?: Record<string, any>) => string|boolean|null)
     *  } & ThisType<INSTANCE>
     *  >(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>):
     *  CLASS & Class<PROPS,ARGS>
     * }}
     */
    static expressions: <CLASS extends typeof CustomElement, ARGS extends ConstructorParameters<CLASS>, INSTANCE extends InstanceType<CLASS>, PROPS extends {
        [x: string]: (data?: INSTANCE, state?: Record<string, any>) => string | boolean | null;
    } & ThisType<INSTANCE>>(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>) => CLASS & Class<PROPS, ARGS>;
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
    static overrides: <CLASS_1 extends typeof CustomElement, ARGS_1 extends ConstructorParameters<CLASS_1>, INSTANCE_1 extends InstanceType<CLASS_1>, PROPS_1 extends Partial<INSTANCE_1>>(this: CLASS_1, source: PROPS_1 & ThisType<PROPS_1 & INSTANCE_1>, options?: Partial<PropertyDescriptor>) => CLASS_1 & Class<PROPS_1, ARGS_1>;
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
    static props: <CLASS_2 extends typeof CustomElement, ARGS_2 extends ConstructorParameters<CLASS_2>, INSTANCE_2 extends InstanceType<CLASS_2>, KEY extends string, OPTIONS extends import("./observe.js").ObserverPropertyType | ObserverOptions<import("./observe.js").ObserverPropertyType, unknown, INSTANCE_2> | ((this: INSTANCE_2, data: Partial<INSTANCE_2>, fn?: () => any) => any), VALUE extends Record<KEY, OPTIONS extends (...args2: any[]) => infer R ? R : OPTIONS extends import("./observe.js").ObserverPropertyType ? import("./observe.js").ParsedObserverPropertyType<OPTIONS> : OPTIONS extends {
        type: 'object';
    } & ObserverOptions<any, infer R_1 extends unknown, any> ? unknown extends R_1 ? object : R_1 : OPTIONS extends {
        type: ObserverPropertyType;
    } ? import("./observe.js").ParsedObserverPropertyType<OPTIONS["type"]> : OPTIONS extends ObserverOptions<any, infer R_2 extends unknown, any> ? unknown extends R_2 ? string : R_2 : never>>(this: CLASS_2, name: KEY, options: OPTIONS) => CLASS_2 & Class<VALUE, ARGS_2>;
    static idl: typeof CustomElement.prop;
    /**
     * @this T
     * @template {typeof CustomElement} T
     * @template {keyof T} K
     * @param {K} collection
     * @param {T[K] extends (infer R)[] ? R : never} callback
     */
    static _addCallback<T_2 extends typeof CustomElement, K_2 extends keyof T_2>(this: T_2, collection: K_2, callback: T_2[K_2] extends (infer R_3)[] ? R_3 : never): void;
    static append<T_3 extends typeof CustomElement>(this: T_3, ...parts: import("./Composition.js").CompositionPart<T>[]): T_3;
    static recompose<T1 extends typeof CustomElement, T2 extends InstanceType<T1>, T3 extends CompositionCallback<T2, T2>["composed"]>(this: T1, callback: T3): T1;
    static css<T1_1 extends typeof CustomElement, T2_1 extends string | TemplateStringsArray | CSSStyleSheet | HTMLStyleElement>(this: T1_1, array: T2_1, ...rest: T2_1 extends string ? any : T2_1 extends TemplateStringsArray ? any[] : (CSSStyleSheet | HTMLStyleElement)[]): T1_1;
    static autoRegister<T_4 extends typeof CustomElement>(this: T_4, elementName: string): T_4;
    static html<T_5 extends typeof CustomElement>(this: T_5, string: TemplateStringsArray, ...substitutions: (string | Element | ((this: InstanceType<T_5>, data: InstanceType<T_5>, injections?: any) => any))[]): T_5;
    static extend<T1_2 extends typeof CustomElement, T2_2 extends T1_2, T3_1 extends (Base: T1_2) => T2_2>(this: T1_2, customExtender?: T3_1): T3_1 extends null ? T1_2 : T2_2;
    static setStatic<T1_3 extends typeof CustomElement, T2_3 extends {
        [x: string]: string | number | boolean | object | any[] | ((this: T1_3, ...args: any[]) => any);
    }>(this: T1_3, source: T2_3 & ThisType<T1_3 & T2_3>): T1_3 & T2_3;
    static readonly<CLASS_3 extends typeof CustomElement, ARGS_3 extends ConstructorParameters<CLASS_3>, INSTANCE_3 extends InstanceType<CLASS_3>, PROPS_2 extends object>(this: CLASS_3, source: PROPS_2 & ThisType<PROPS_2 & INSTANCE_3>, options?: Partial<PropertyDescriptor>): CLASS_3 & Class<PROPS_2, ARGS_3>;
    static set<CLASS_4 extends typeof CustomElement, ARGS_4 extends ConstructorParameters<CLASS_4>, INSTANCE_4 extends InstanceType<CLASS_4>, PROPS_3 extends object>(this: CLASS_4, source: PROPS_3 & ThisType<PROPS_3 & INSTANCE_4>, options?: Partial<PropertyDescriptor>): CLASS_4 & Class<PROPS_3, ARGS_4>;
    static mixin<BASE extends typeof CustomElement, FN extends (...args: any[]) => any, RETURN extends ReturnType<FN>, SUBCLASS extends RETURN>(this: BASE, mixin: FN): SUBCLASS & BASE;
    static register<T_6 extends typeof CustomElement>(this: T_6, elementName?: string, force?: boolean): T_6;
    static get propList(): Map<string, import("./observe.js").ObserverConfiguration<any, any, any, any>>;
    static get attrList(): Map<string, import("./observe.js").ObserverConfiguration<any, any, any, any>>;
    static get propChangedCallbacks(): Map<string, Function[]>;
    static get attributeChangedCallbacks(): Map<string, Function[]>;
    static prop<CLASS_5 extends typeof CustomElement, ARGS_5 extends ConstructorParameters<CLASS_5>, INSTANCE_5 extends InstanceType<CLASS_5>, KEY_1 extends string, OPTIONS_1 extends import("./observe.js").ObserverPropertyType | ObserverOptions<import("./observe.js").ObserverPropertyType, unknown, INSTANCE_5> | ((this: INSTANCE_5, data: Partial<INSTANCE_5>, fn?: () => any) => any), VALUE_1 extends Record<KEY_1, OPTIONS_1 extends (...args2: any[]) => infer R_4 ? R_4 : OPTIONS_1 extends import("./observe.js").ObserverPropertyType ? import("./observe.js").ParsedObserverPropertyType<OPTIONS_1> : OPTIONS_1 extends {
        type: 'object';
    } & ObserverOptions<any, infer R_5 extends unknown, any> ? unknown extends R_5 ? object : R_5 : OPTIONS_1 extends {
        type: ObserverPropertyType;
    } ? import("./observe.js").ParsedObserverPropertyType<OPTIONS_1["type"]> : OPTIONS_1 extends ObserverOptions<any, infer R_6 extends unknown, any> ? unknown extends R_6 ? string : R_6 : never>>(this: CLASS_5, name: KEY_1, options: OPTIONS_1): CLASS_5 & Class<VALUE_1, ARGS_5>;
    static define<CLASS_6 extends typeof CustomElement, ARGS_6 extends ConstructorParameters<CLASS_6>, INSTANCE_6 extends InstanceType<CLASS_6>, PROPS_4 extends {
        [x: string]: {
            enumerable?: boolean;
            configurable?: boolean;
            writable?: boolean;
            value?: any;
            get?: (this: INSTANCE_6) => any;
            set?: (this: INSTANCE_6, value: any) => void;
        } | ((this: INSTANCE_6, ...args: any[]) => any);
    }, VALUE_2 extends { [KEY_2 in keyof PROPS_4]: PROPS_4[KEY_2] extends (...args2: any[]) => infer R_7 ? R_7 : PROPS_4[KEY_2] extends TypedPropertyDescriptor<infer R_8> ? R_8 : never; }>(this: CLASS_6, props: PROPS_4 & ThisType<PROPS_4 & INSTANCE_6>): CLASS_6 & Class<VALUE_2, ARGS_6>;
    static undefine(name: any): typeof CustomElement;
    static observe<CLASS_7 extends typeof CustomElement, ARGS_7 extends ConstructorParameters<CLASS_7>, INSTANCE_7 extends InstanceType<CLASS_7>, PROPS_5 extends IDLParameter<INSTANCE_7 & VALUE_3>, VALUE_3 extends { [KEY_3 in keyof PROPS_5]: PROPS_5[KEY_3] extends (...args2: any[]) => infer R_9 ? R_9 : PROPS_5[KEY_3] extends import("./observe.js").ObserverPropertyType ? import("./observe.js").ParsedObserverPropertyType<PROPS_5[KEY_3]> : PROPS_5[KEY_3] extends {
        type: 'object';
    } & ObserverOptions<any, infer R_10 extends unknown, any> ? unknown extends R_10 ? object : R_10 : PROPS_5[KEY_3] extends {
        type: ObserverPropertyType;
    } ? import("./observe.js").ParsedObserverPropertyType<PROPS_5[KEY_3]["type"]> : PROPS_5[KEY_3] extends ObserverOptions<any, infer R_11 extends unknown, any> ? unknown extends R_11 ? string : R_11 : never; }>(this: CLASS_7, props: PROPS_5): CLASS_7 & Class<VALUE_3, ARGS_7>;
    static defineStatic<T1_4 extends typeof CustomElement, T2_4 extends IDLParameter<T1_4>>(this: T1_4, props: T2_4): T1_4 & ParsedProps<T2_4>;
    static events<T_7 extends typeof CustomElement>(this: T_7, listeners?: import("./Composition.js").CompositionEventListenerObject<InstanceType<T_7>>, options?: Partial<import("./Composition.js").CompositionEventListener<InstanceType<T_7>, string>>): T_7;
    static childEvents<T_8 extends typeof CustomElement>(this: T_8, listenerMap: {
        [x: string]: import("./Composition.js").CompositionEventListenerObject<InstanceType<T_8>>;
    }, options?: Partial<import("./Composition.js").CompositionEventListener<InstanceType<T_8>, string>>): T_8;
    static rootEvents<T_7 extends typeof CustomElement>(this: T_7, listeners?: import("./Composition.js").CompositionEventListenerObject<InstanceType<T_7>>, options?: Partial<import("./Composition.js").CompositionEventListener<InstanceType<T_7>, string>>): T_7;
    static on<T1_5 extends typeof CustomElement, T2_5 extends InstanceType<T1_5>, T3_2 extends CompositionCallback<T2_5, T2_5>, T4 extends keyof T3_2>(this: T1_5, name: T3_2 | T4, callbacks?: T3_2[T4] & ThisType<T2_5>): T1_5;
    static onPropChanged<T1_6 extends typeof CustomElement, T2_6 extends InstanceType<T1_6>>(this: T1_6, options: ObjectOrObjectEntries<{ [P_1 in keyof T2_6]?: (this: T2_6, oldValue: T2_6[P_1], newValue: T2_6[P_1], changes: any, element: T2_6) => void; }>): T1_6;
    static onAttributeChanged<T1_7 extends typeof CustomElement, T2_7 extends InstanceType<T1_7>>(this: T1_7, options: {
        [x: string]: (this: T2_7, oldValue: string, newValue: string, element: T2_7) => void;
    }): T1_7;
    /** @param {any[]} args */
    constructor(...args: any[]);
    compose(parts: import("./Composition.js").CompositionPart<T>[]): Composition<any>;
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
    propChangedCallback<T_1 extends CustomElement, K extends string = string>(this: T_1, name: K, oldValue: K extends keyof T_1 ? T_1[K] : unknown, newValue: K extends keyof T_1 ? T_1[K] : unknown, changes?: K extends keyof T_1 ? T_1[K] extends object ? Partial<T_1[K]> : T_1[K] : unknown): void;
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
export type ObserverPropertyType = import('./observe.js').ObserverPropertyType;
export type ParsedProps<T extends unknown> = { [P in keyof T]: T[P] extends (...args: any[]) => infer T2 ? T2 : T[P] extends import("./observe.js").ObserverPropertyType ? import("./observe.js").ParsedObserverPropertyType<T[P]> : T[P] extends {
    type: ObserverPropertyType;
} ? import("./observe.js").ParsedObserverPropertyType<T[P]["type"]> : T[P] extends ObserverOptions<null, infer T2_1 extends unknown, any> ? unknown extends T2_1 ? string : T2_1 : never; };
export type ObserverOptions<T1 extends import("./observe.js").ObserverPropertyType, T2 extends unknown, C extends Object = any> = import('./observe.js').ObserverOptions<T1, T2, C>;
/**
 * <T>
 */
export type ClassOf<T extends {
    prototype: unknown;
}> = T;
export type Class<T extends unknown = any, A extends any[] = any[]> = new (...args: A) => T;
export type HTMLTemplater<T1 extends unknown, T2 extends unknown = T1> = (string: TemplateStringsArray, ...substitutions: (string | Element | DocumentFragment | ((this: T1, data: T2) => any))[]) => DocumentFragment;
export type CallbackArguments<T1 extends unknown = any, T2 extends unknown = T1> = {
    composition: Composition<T1>;
    refs: Record<string, HTMLElement>;
    html: HTMLTemplater<T1, Partial<T2>>;
    inline: (fn: (this: T1, data: { [K in keyof T2]?: T2[K]; }) => any) => string;
    template: DocumentFragment;
    element: T1;
};
export type CompositionCallback<T1 extends unknown, T2 extends unknown = T1> = {
    composed?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    constructed?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    connected?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    disconnected?: (this: T1, options: CallbackArguments<T1, T2>) => any;
    props?: { [P in keyof T1]: (this: T1, oldValue: T1[P], newValue: T1[P], changes: any, element: T1) => any; };
    attrs?: {
        [x: string]: (this: T1, oldValue: string, newValue: string, element: T1) => unknown;
    };
} & { [P_1 in keyof T1 & string as `${P_1}Changed`]?: (this: T1, oldValue: T1[P_1], newValue: T1[P_1], changes: any, element: T1) => any; };
export type IDLParameter<C extends Object> = {
    [x: string]: import("./observe.js").ObserverPropertyType | ObserverOptions<import("./observe.js").ObserverPropertyType, unknown, C> | ((this: C, data: Partial<C>, fn?: () => any) => any);
};
export type ObjectOrObjectEntries<T> = (T | Array<[keyof T & string, T[keyof T]]>);
import Composition from './Composition.js';
import { addInlineFunction } from './template.js';
//# sourceMappingURL=CustomElement.d.ts.map