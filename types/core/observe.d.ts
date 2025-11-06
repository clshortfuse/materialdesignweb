/**
 * @param {(data: Partial<any>) => any} fn
 * @param {...any} args
 * @this {any}
 * @return {{
 *  props: {
 *    this: string[],
 *    args: string[][],
 *  },
 *  deepPropStrings: {
 *   this: string[],
 *   args: string[][],
 *  },
 *  deepProps: {
 *   this: string[][],
 *   args: string[][][],
 *  },
 *  defaultValue: any,
 *  reusable: boolean,
 * }}
 */
export function observeFunction(this: any, fn: (data: Partial<any>) => any, ...args: any[]): {
    props: {
        this: string[];
        args: string[][];
    };
    deepPropStrings: {
        this: string[];
        args: string[][];
    };
    deepProps: {
        this: string[][];
        args: string[][][];
    };
    defaultValue: any;
    reusable: boolean;
};
/**
 * @template {string} K
 * @template {ObserverPropertyType} [T1=any]
 * @template {any} [T2=ParsedObserverPropertyType<T1>]
 * @template {Object} [C=any]
 * @param {K} name
 * @param {T1|ObserverOptions<T1,T2>} [typeOrOptions='string']
 * @param {any} [object]
 * @return {ObserverConfiguration<T1,T2,C,K> & ObserverOptions<T1,T2,C>}
 */
export function parseObserverOptions<K extends string, T1 extends ObserverPropertyType = any, T2 extends unknown = ParsedObserverPropertyType<T1>, C extends Object = any>(name: K, typeOrOptions?: T1 | ObserverOptions<T1, T2>, object?: any): ObserverConfiguration<T1, T2, C, K> & ObserverOptions<T1, T2, C>;
/**
 * @this {ObserverConfiguration<?,?,?>}
 * @param {*} value
 */
export function parsePropertyValue(this: ObserverConfiguration<any, any, any, any>, value: any): any;
/**
 * @template {ObserverPropertyType} T1
 * @template {any} T2
 * @template {Object} C
 * @template {keyof C & string} K
 * @param {C} object
 * @param {K} key
 * @param {ObserverOptions<T1, T2, C>} options
 * @return {ObserverConfiguration<T1,T2,C,K>}
 */
export function defineObservableProperty<T1 extends ObserverPropertyType, T2 extends unknown, C extends Object, K extends keyof C & string>(object: C, key: K, options: ObserverOptions<T1, T2, C>): ObserverConfiguration<T1, T2, C, K>;
export type ObserverPropertyType = "string" | "boolean" | "map" | "set" | "float" | "integer" | "object" | "function" | "array";
export type ParsedObserverPropertyType<T extends ObserverPropertyType> = (T extends "boolean" ? boolean : T extends "string" ? string : T extends "float" | "integer" ? number : T extends "array" ? any[] : T extends "object" ? any : T extends "function" ? (...args: any) => any : unknown);
export type ObserverOptions<T1 extends ObserverPropertyType, T2 extends unknown, C extends Object = any> = {
    type?: T1;
    enumerable?: boolean;
    reflect?: boolean | "write" | "read";
    attr?: string;
    /**
     * Defaults to false if type is boolean
     */
    readonly?: boolean;
    nullable?: boolean;
    empty?: T2;
    value?: T2;
    /**
     * Function used when null passed
     */
    get?: (this: C, data: Partial<C>, fn?: () => T2) => T2;
    parser?: (this: C, value: any) => T2;
    nullParser?: (this: C, value: null | undefined) => T2;
    /**
     * Function used when comparing
     */
    set?: (this: C, value: T2, fn?: (value2: T2) => any) => any;
    diff?: (this: C, a: T2, b: T2) => any;
    /**
     * Simple callback
     */
    is?: (this: C, a: T2, b: T2) => boolean;
    /**
     * Named callback
     */
    changedCallback?: (this: C, oldValue: T2, newValue: T2, changes: any) => any;
    /**
     * Attribute callback
     */
    propChangedCallback?: (this: C, name: string, oldValue: T2, newValue: T2, changes: any) => any;
    attributeChangedCallback?: (this: C, name: keyof C & string, oldValue: string, newValue: string) => any;
    watchers?: [keyof C & string, (this: C, ...args: any[]) => any][];
    props?: Set<keyof C & string>;
    values?: WeakMap<C, T2>;
    computedValues?: WeakMap<C, T2>;
    needsSelfInvalidation?: WeakSet<C>;
};
export type ObserverConfiguration<T1 extends ObserverPropertyType, T2 extends unknown = any, C extends Object = any, K extends keyof C & string = any> = ObserverOptions<T1, T2, C> & {
    key: K;
    values?: WeakMap<C, T2>;
    attrValues?: WeakMap<C, string>;
};
//# sourceMappingURL=observe.d.ts.map