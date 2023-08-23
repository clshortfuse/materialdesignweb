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
 * @param {K} name
 * @param {T1|ObserverOptions<T1,T2>} [typeOrOptions='string']
 * @param {any} [object]
 * @return {ObserverConfiguration<T1,T2,K> & ObserverOptions<T1,T2>}
 */
export function parseObserverOptions<K extends string, T1 extends ObserverPropertyType = any, T2 extends unknown = ParsedObserverPropertyType<T1>>(name: K, typeOrOptions?: T1 | ObserverOptions<T1, T2, any>, object?: any): ObserverOptions<T1, T2, any> & {
    key: K;
    values?: WeakMap<any, T2>;
    attrValues?: WeakMap<any, string>;
};
/**
 * @this {ObserverConfiguration<?,?,?>}
 * @param {*} value
 */
export function parsePropertyValue(this: ObserverConfiguration<any, any, any, any>, value: any): void;
/**
 * @template {ObserverPropertyType} T1
 * @template {any} T2
 * @template {string} K
 * @template [C=any]
 * @param {C} object
 * @param {K} key
 * @param {ObserverOptions<T1, T2, C>} options
 * @return {ObserverConfiguration<T1,T2,K,C>}
 */
export function defineObservableProperty<T1 extends ObserverPropertyType, T2 extends unknown, K extends string, C = any>(object: C, key: K, options: ObserverOptions<T1, T2, C>): ObserverConfiguration<T1, T2, K, C>;
export type ObserverPropertyType = 'string' | 'boolean' | 'map' | 'set' | 'float' | 'integer' | 'object' | 'function' | 'array';
export type ParsedObserverPropertyType<T extends ObserverPropertyType> = T extends "boolean" ? boolean : T extends "string" ? string : T extends "float" | "integer" ? number : T extends "array" ? any[] : T extends "object" ? any : T extends "function" ? (...args: any) => any : unknown;
export type ObserverOptions<T1 extends ObserverPropertyType, T2 extends unknown, C extends Object = any> = {
    type?: T1;
    attr?: string;
    readonly?: boolean;
    /**
     * Defaults to false if type is boolean
     */
    enumerable?: boolean;
    nullable?: boolean;
    empty?: T2;
    value?: T2;
    values?: WeakMap<C, T2>;
    /**
     * Function used when null passed
     */
    reflect?: boolean | 'write' | 'read';
    nullParser?: (this: C, value: null | undefined) => T2;
    /**
     * Function used when comparing
     */
    parser?: (this: C, value: any) => T2;
    diff?: (this: C, a: T2, b: T2) => any;
    is?: (this: C, a: T2, b: T2) => boolean;
    get?: (this: C, data: Partial<C>, fn?: () => T2) => T2;
    /**
     * Simple callback
     */
    set?: (this: C, value: T2, fn?: (value2: T2) => any) => any;
    /**
     * Named callback
     */
    changedCallback?: (this: C, oldValue: T2, newValue: T2, changes: any) => any;
    /**
     * Attribute callback
     */
    propChangedCallback?: (this: C, name: string, oldValue: T2, newValue: T2, changes: any) => any;
    attributeChangedCallback?: (this: C, name: string, oldValue: string, newValue: string) => any;
    computedValues?: WeakMap<C, T2>;
    watchers?: [keyof C, (this: C, ...args: any[]) => any][];
    needsSelfInvalidation?: WeakSet<C>;
    props?: Set<keyof C>;
};
export type ObserverConfiguration<T1 extends ObserverPropertyType, T2 extends unknown = any, K extends string = string, C extends Object = any> = ObserverOptions<T1, T2, C> & {
    key: K;
    values?: WeakMap<C, T2>;
    attrValues?: WeakMap<C, string>;
};
//# sourceMappingURL=observe.d.ts.map