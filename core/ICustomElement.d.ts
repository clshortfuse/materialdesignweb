/* eslint-disable no-use-before-define */

import Composition from './Composition.js';
import {
  CompositionEventListener,
  CompositionEventListenerObject,
  HTMLTemplater,
  InlineTemplate,
  ObserverOptions,
  ObserverPropertyType,
  ParsedObserverPropertyType,
  ParsedProps,
} from './typings.js';

type ClassOf<T extends { prototype: unknown; } > = T;

type CallbackArguments<T1 = any, T2 = T1> = {
  composition: Composition<T1>,
  html: HTMLTemplater<T1, Partial<T2>>,
  inline: InlineTemplate<T1, Partial<T2>>,
  template: DocumentFragment,
  $: DocumentFragment['querySelector'],
  $$: DocumentFragment['querySelectorAll'],
  element: T1
}

type IDLParameter<C> = {
  [P in string] :
    ObserverPropertyType
    | ObserverOptions<ObserverPropertyType, unknown, C>
    | ((this:C, data:Partial<C>, fn?: () => any) => any)
};

declare type DefinedPropertiesOf<T extends abstract new (...args: any) => any, P> =
  Omit<T, 'prototype'>
  & (new (...args: ConstructorParameters<T>) => InstanceType<T> & P
    // & {constructor: Partial<T>}
  )
  & { prototype: InstanceType<T> & P
    // & {constructor: Partial<T>}
  };

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
      element: T1
      ) => any
    },
    attrs?: Record<string, (
      this: T1,
      oldValue: string,
      newValue: string,
      element: T1
      ) => unknown
    >,
  } & {
    [P in keyof T1 & string as `${P}Changed`]?: (
      this: T1,
      oldValue: T1[P],
      newValue: T1[P],
      element: T1
      ) => any
  }

declare interface ICustomElementInstance extends HTMLElement {
  ariaActiveDescendantElement: Element
  propChangedCallback<
    T extends ICustomElementInstance,
    K extends string = string,
  >(this:T, name: K, oldValue: K extends keyof T ? T[K] : unknown, newValue: K extends keyof T ? T[K] : unknown): void;

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

  html<T extends typeof ICustomElement>(
    this: T,
    string: TemplateStringsArray,
    ...substitutions: (string|Element|((this:InstanceType<T>, data:InstanceType<T> & T['schema']) => any))[]
    ): T

  css<
    T1 extends typeof ICustomElement,
    T2 extends TemplateStringsArray|HTMLStyleElement|CSSStyleSheet>(
    this: T1,
    array: T2,
    ...rest: T2 extends TemplateStringsArray ? string[] : (HTMLStyleElement|CSSStyleSheet)[]
  ): T1

  define<
    T1 extends typeof ICustomElement,
    T2 extends InstanceType<T1>,
    T3 extends {
        [P in string] :
          {
            enumerable?: boolean;
            configurable?: boolean;
            writable?: boolean;
            value?: any;
            get?: (this: T2) => any;
            set?: (this: T2, value: any) => void;
          } | ((this: T2, ...args:any[]) => any)
      }>
    (this: T1, props: T3): T1 & (new (...args: ConstructorParameters<T1>) => T2 & {
          [P in keyof T3]: T3[P] extends (...args2:any[]) => infer R ? R
            : T3[P] extends TypedPropertyDescriptor<infer R> ? R : never
        });

  observe<
    T1 extends typeof ICustomElement,
    T2 extends InstanceType<T1>,
    T3 extends IDLParameter<T2>>
    (this: T1, props: T3): T1 & (new (...args: ConstructorParameters<T1>) => T2 & {
        [P in keyof T3]:
          T3[P] extends (...args2:any[]) => infer R ? R
            : T3[P] extends ObserverPropertyType
            ? ParsedObserverPropertyType<T3[P]>
            : T3[P] extends {type: ObserverPropertyType}
            ? ParsedObserverPropertyType<T3[P]['type']>
            : T3[P] extends ObserverOptions<any, infer R>
            ? unknown extends R ? string : R
            : never
      });

  props: typeof ICustomElement.observe;

  set<T1 extends typeof ICustomElement, T2 extends object>
    (this: T1, source: T2 & ThisType<T2 & InstanceType<T1>>, options?: Partial<PropertyDescriptor>)
    : T1 & (new (...args: ConstructorParameters<T1>) => InstanceType<T1> & T2)
      // & { prototype: InstanceType<T1> & T2 };

  methods: typeof ICustomElement.set;

  overrides<T1 extends typeof ICustomElement, T2 extends Partial<InstanceType<T1>>>
  (this: T1, source: T2 & ThisType<T2 & InstanceType<T1>>, options?: Partial<PropertyDescriptor>)
  : T1 & (new (...args: ConstructorParameters<T1>) => InstanceType<T1> & T2)
    // & { prototype: InstanceType<T1> & T2 };

  expressions<
    T1 extends typeof ICustomElement,
    T2 extends Record<
      string,
      ((this: InstanceType<T1>, data?: InstanceType<T1> & T1['schema']) => string|boolean|null)
      >
    >(this: T1, expressions: T2 & ThisType<InstanceType<T1> & T2>):
      T1 & (new (...args: ConstructorParameters<T1>) => InstanceType<T1> & T2);

  defineStatic<
    T1 extends typeof ICustomElement,
    T2 extends IDLParameter<T1>>
    (this: T1, props: T2):T1 & ParsedProps<T2>;

  setStatic<
    T1 extends typeof ICustomElement,
    T2 extends Record<string,
      (
        ((this:T1, ...args:any[]) => any)
        |string|number|boolean|any[]|object)>
    >
    (this: T1, source: T2 & ThisType<T1 & T2>):T1 & T2;

  autoRegister<T extends typeof ICustomElement>
    (this: T, elementName: string): T;

  setSchema<
    T1 extends typeof ICustomElement,
    T2 extends Record<string, unknown>
    >
    (this: T1, schema: T2): T1 & {schema: T2};

  register<T extends typeof ICustomElement>
    (this: T, elementName?: string, force?: boolean): T;

  append<
    T extends typeof ICustomElement,
    >
    (this: T, ...parts: ConstructorParameters<typeof Composition<InstanceType<T>>>): T;

  mixin<
    T extends typeof ICustomElement,
    F extends (...args:any[]) => any,
    M extends ReturnType<F>,
    C extends ClassOf<M>>
    (this: T, mixin: F): C & T
      & (new (...args: ConstructorParameters<C>) => InstanceType<C> & InstanceType<T>)
      // & { prototype: InstanceType<C> & InstanceType<T> };

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

  on<
    T1 extends typeof ICustomElement,
    T3 extends CompositionCallback<InstanceType<T1>, InstanceType<T1> & T1['schema']>,
    T4 extends keyof T3,
    >
    (this: T1, name: T3|T4, callbacks?: T3[T4] & ThisType<InstanceType<T1>>): T1

  onPropChanged<
    T1 extends typeof ICustomElement,
    T2 extends keyof InstanceType<T1>
    >
    (
      this: T1,
      options: Record<T2, (
        // eslint-disable-next-line no-shadow
        this: InstanceType<T1>,
        oldValue: InstanceType<T1>[T2],
        newValue: InstanceType<T1>[T2],
        element: InstanceType<T1>
        ) => any>,
    ): T1;

  onAttributeChanged<T extends typeof ICustomElement>
    (
      this: T,
      options: Record<string, (
        // eslint-disable-next-line no-shadow
        this: InstanceType<T>,
        oldValue: string,
        newValue: string,
        element: InstanceType<T>
        ) => unknown
      >,
    ): T;
};
