/* eslint-disable no-use-before-define */

import Composition from './Composition.js';
import {
  CompositionEventListener,
  CompositionEventListenerObject,
  HTMLTemplater,
  ObserverOptions,
  ObserverPropertyType,
  ParsedObserverPropertyType,
  ParsedProps,
} from './typings.js';

type ClassOf<T extends { prototype: unknown; } > = T;

type CallbackArguments<T1 = any, T2 = T1> = {
  composition: Composition<T1>;
  refs: Record<string, HTMLElement>;
  html: HTMLTemplater<T1, Partial<T2>>;
  inline: (fn: (this:T1, data: {[K in keyof T2]?: T2[K]}) => any) => string;
  template: DocumentFragment;
  element: T1;
}

type IDLParameter<C extends object> = {
  [P in string] :
    ObserverPropertyType
    | ObserverOptions<ObserverPropertyType, unknown, C>
    | ((this:C, data:Partial<C>, fn?: () => any) => any)
};

type ExtendedClass<T1 extends typeof ICustomElement, T2 extends abstract new (...args: any) => any> =
  Omit<T1, 'prototype'> & T2;

type ConstructorLess<T1 extends object, T2 extends abstract new (...args: any) => any> = T1 & T2;

declare type DefinedPropertiesOf<T extends ({ prototype: unknown; } & (new (...args: any) => any)), P> =
  {[K in keyof T]: T[K]}
  & { new(): (...args: ConstructorParameters<T>) => InstanceType<T> & P}
  & { prototype: T['prototype'] & P };

type CompositionCallback<T1, T2=T1> = {
    composed?: (this: T1, options: CallbackArguments<T1, T2>) => any,
    constructed?: (this: T1, options: CallbackArguments<T1, T2>) => any,
    connected?: (this: T1, options: CallbackArguments<T1, T2>) => any,
    disconnected?: (this: T1, options: CallbackArguments<T1, T2>) => any,
    props?: {
      [P in keyof T1] : (
      this: T1,
      oldValue: T1[P],
      newValue: T1[P],
      changes:any,
      element: T1
      ) => any
    },
    attrs?: {[K in keyof any]: (
      this: T1,
      oldValue: string,
      newValue: string,
      element: T1
      ) => unknown
    },
  } & {
    [P in keyof T1 & string as `${P}Changed`]?: (
      this: T1,
      oldValue: T1[P],
      newValue: T1[P],
      changes:any,
      element: T1
      ) => any
  }

declare interface ICustomElementInstance extends HTMLElement {
  ariaActiveDescendantElement: Element
  propChangedCallback<
    T extends ICustomElementInstance,
    K extends string = string,
  >(this:T,
      name: K,
      oldValue: K extends keyof T ? T[K] : unknown,
      newValue: K extends keyof T ? T[K] : unknown,
      changes?: K extends keyof T ? T[K] extends object ? Partial<T[K]> : T[K] : unknown): void;

}

interface ConstructorOf<T> {
  new(): T;
}

export declare const ICustomElement: {
  new(): ICustomElementInstance;
  prototype: ICustomElementInstance;

  _onComposeCallbacks: ((callback: CallbackArguments) => any)[];

  _onConnectedCallbacks: ((callback: CallbackArguments) => any)[];

  _onDisconnectedCallbacks: ((callback: CallbackArguments) => any)[];

  _onConstructedCallbacks: ((callback: CallbackArguments) => any)[];

  schema: Record<string, unknown>;

  extend<T extends typeof ICustomElement>(this: T): T;

  tsClassFix<T extends typeof ICustomElement>(this:T): T & (new (...args:any[]) => InstanceType<T>)

  html<T extends typeof ICustomElement>(
    this: T,
    string: TemplateStringsArray,
    // eslint-disable-next-line no-shadow
    ...substitutions: (string|Element|((this:InstanceType<T>, data:InstanceType<T> & T['schema'], injections?:any) => any))[]
    ): T

  css<
    T1 extends typeof ICustomElement,
    T2 extends TemplateStringsArray|HTMLStyleElement|CSSStyleSheet>(
    this: T1,
    array: T2,
    ...rest: T2 extends TemplateStringsArray ? any[] : (HTMLStyleElement|CSSStyleSheet)[]
  ): T1

  define<
    CLASS extends typeof ICustomElement,
    ARGS extends ConstructorParameters<CLASS>,
    INSTANCE extends InstanceType<CLASS>,
    PROPS extends {
        [P in keyof any] :
          {
            enumerable?: boolean;
            configurable?: boolean;
            writable?: boolean;
            value?: any;
            get?: ((this: INSTANCE) => any);
            set?: (this: INSTANCE, value: any) => void;
          } | ((this: INSTANCE, ...args:any[]) => any)
      },
    VALUE extends {
      [KEY in keyof PROPS]: PROPS[KEY] extends (...args2:any[]) => infer R ? R
        : PROPS[KEY] extends TypedPropertyDescriptor<infer R> ? R : never
    }>
    (this: CLASS, props: PROPS & ThisType<PROPS & INSTANCE>): CLASS
      & (new (...args: ARGS) => INSTANCE & VALUE)

  observe<
    CLASS extends typeof ICustomElement,
    ARGS extends ConstructorParameters<CLASS>,
    INSTANCE extends InstanceType<CLASS>,
    PROPS extends IDLParameter<INSTANCE>,
    VALUE extends {
      [KEY in keyof PROPS]:
      PROPS[KEY] extends (...args2:any[]) => infer R ? R
          : PROPS[KEY] extends ObserverPropertyType ? ParsedObserverPropertyType<PROPS[KEY]>
          : PROPS[KEY] extends {type: 'object'} & ObserverOptions<any, infer R> ? (unknown extends R ? object : R)
          : PROPS[KEY] extends {type: ObserverPropertyType} ? ParsedObserverPropertyType<PROPS[KEY]['type']>
          : PROPS[KEY] extends ObserverOptions<any, infer R> ? (unknown extends R ? string : R)
          : never
    },
    > (this: CLASS, props: PROPS)
      : CLASS & (new (...args: ARGS) => INSTANCE & VALUE)

  props: typeof ICustomElement.observe;

  set<
    CLASS extends typeof ICustomElement,
    ARGS extends ConstructorParameters<CLASS>,
    INSTANCE extends InstanceType<CLASS>,
    PROPS extends object>
    (this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>)
    : CLASS & (new(...args: ARGS) => INSTANCE & PROPS)

  methods: typeof ICustomElement.set;

  overrides<
  CLASS extends typeof ICustomElement,
  ARGS extends ConstructorParameters<CLASS>,
  INSTANCE extends InstanceType<CLASS>,
  PROPS extends Partial<INSTANCE>>
  (this: CLASS, source: PROPS & ThisType<PROPS & INSTANCE>, options?: Partial<PropertyDescriptor>)
  : CLASS & (new(...args: ARGS) => INSTANCE & PROPS)

  expressions<
    CLASS extends typeof ICustomElement,
    ARGS extends ConstructorParameters<CLASS>,
    INSTANCE extends InstanceType<CLASS>,
    PROPS extends {
      [K in keyof any]: ((this: INSTANCE, data?: INSTANCE & CLASS['schema']) => string|boolean|null)
    }
    >(this: CLASS, expressions: PROPS & ThisType<INSTANCE & PROPS>):
    CLASS & (new (...args: ARGS) => INSTANCE & PROPS)

  defineStatic<
    T1 extends typeof ICustomElement,
    T2 extends IDLParameter<T1>>
    (this: T1, props: T2):T1 & ParsedProps<T2>;

  setStatic<
    T1 extends typeof ICustomElement,
    T2 extends {
      [K in keyof any]: (
        ((this:T1, ...args:any[]) => any)
        |string|number|boolean|any[]|object)}
    >
    (this: T1, source: T2 & ThisType<T1 & T2>):T1 & T2;

  autoRegister<T extends typeof ICustomElement>
    (this: T, elementName: string): T;

  setSchema<
    T1 extends typeof ICustomElement,
    T2 extends {[K in keyof any]: unknown}
    >
    (this: T1, schema: T2): T1 & {schema: T2};

  register<T extends typeof ICustomElement>
    (this: T, elementName?: string, force?: boolean): T;

  append<
    T extends typeof ICustomElement,
    >
    (this: T, ...parts: ConstructorParameters<typeof Composition<InstanceType<T>>>): T;

  mixin<
    BASE extends typeof ICustomElement,
    FN extends (...args:any[]) => any,
    RETURN extends ReturnType<FN>,
    SUBCLASS extends ClassOf<RETURN>,
    ARGS extends ConstructorParameters<SUBCLASS>,
    BASE_INSTANCE extends InstanceType<BASE>,
    SUBCLASS_INSTANCE extends InstanceType<SUBCLASS>>
    (this: BASE, mixin: FN): SUBCLASS & BASE
      & (new (...args: ARGS) => SUBCLASS_INSTANCE & BASE_INSTANCE)

  events<T extends typeof ICustomElement>
    (
      this: T,
      listeners?: CompositionEventListenerObject<InstanceType<T>>,
      options?: Partial<CompositionEventListener<InstanceType<T>>>,
    ): T;

  childEvents<T extends typeof ICustomElement>
    (
      this: T,
      listenerMap: {
        [P in keyof any]: CompositionEventListenerObject<InstanceType<T>>
      },
      options?: Partial<CompositionEventListener<InstanceType<T>>>,
    ): T;

  recompose<
    T1 extends typeof ICustomElement,
    T2 extends InstanceType<T1>,
    T3 extends CompositionCallback<T2, T2 & T1['schema']>['composed'],
    >
    (this: T1, callback: T3): T1

  on<
    T1 extends typeof ICustomElement,
    T2 extends InstanceType<T1>,
    T3 extends CompositionCallback<T2, T2 & T1['schema']>,
    T4 extends keyof T3,
    >
    (this: T1, name: T3|T4, callbacks?: T3[T4] & ThisType<T2>): T1

  onPropChanged<
    T1 extends typeof ICustomElement,
    T2 extends InstanceType<T1>
    >
    (
      this: T1,
      options: {
        [P in keyof T2]? : (
        // eslint-disable-next-line no-shadow
        this: T2,
        oldValue: T2[P],
        newValue: T2[P],
        changes:any,
        element: T2
        ) => void
      },
    ): T1;

  onAttributeChanged<
    T1 extends typeof ICustomElement,
    T2 extends InstanceType<T1>
    >
    (
      this: T1,
      options: {
        [x:string]: (
        // eslint-disable-next-line no-shadow
        this: T2,
        oldValue: string,
        newValue: string,
        element: T2
        ) => void
      },
    ): T1;
};
