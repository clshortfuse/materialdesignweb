import { ElementIdentifier } from './identify.js';

type ObserverPropertyType = 'string' | 'boolean' | 'map' | 'set' | 'float' | 'integer' | 'object' | 'function';

type InlineTemplate<T1, T2=T1> = (fn: (this:T1, data: T2) => any) => string;

type HTMLTemplater<T1, T2=T1> = ((
  string: TemplateStringsArray, ...substitutions: (string|Element|((this:T1, data:T2) => any))[]
) => DocumentFragment);

type ParsedObserverPropertyType<T extends ObserverPropertyType> =
  T extends 'boolean' ? boolean
  : T extends 'string' ? string
  : T extends 'float' | 'integer' ? number
  // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends 'object' ? {}
  : T extends 'function' ? (...args:any) => any
  : unknown;

type ObserverOptions<
  T1 extends ObserverPropertyType,
  T2 = any,
  C = any
  > = {
  type?: T1;
  attr?: string;

  /** Default true */
  readonly?: boolean
  enumerable?: boolean;

  /** Defaults to false if type is boolean */
  nullable?: boolean;

  /** Empty value when not nullable */
  empty?: T2;
  /** Initial value (empty value if not specified) */
  value?: T2;
  values?: Map<C, T2>;
  reflect?: boolean | 'write' | 'read';
  /** Function used when null passed */
  changedCallback?: (this:C, oldValue:T2, newValue:T2)=>any;
  nullParser?: (this:C, value:null|undefined)=>T2;
  parser?: (this:C, value:any)=>T2;
  /** Function used when comparing */
  is?: (this:C, a:T2, b:T2)=>boolean
  get?: (this:C) => T2
  set?: (this:C, value: T2) => T2,
  attributeChangedCallback?: (this:C, name:string, oldValue: string, newValue: string) => any;
  propChangedCallback?: (this:C, name:string, oldValue: T2, newValue: T2) => any;
}

type ObserverConfiguration<
  T1 extends ObserverPropertyType,
  T2 = any,
  K = string,
  C extends object = any> = ObserverOptions<T1, T2, C> & {
    key: K,
    values?: WeakMap<C, T2>;
    attrValues?: WeakMap<C, string>;
  };

type ParsedProps<T> = {
  [P in keyof T]:
    T[P] extends (...args:any[]) => infer T2 ? T2
      : T[P] extends ObserverPropertyType
      ? ParsedObserverPropertyType<T[P]>
      : T[P] extends {type: ObserverPropertyType}
      ? ParsedObserverPropertyType<T[P]['type']>
      : T[P] extends ObserverOptions<null, infer T2>
      ? unknown extends T2 ? string : T2
      : never
};

type HTMLElementCancellableEventMap = Pick<HTMLElementEventMap,
  'auxclick' |
  'beforeinput' |
  // 'cancel' |
  'click' |
  'compositionstart' |
  'contextmenu' |
  'drag' |
  'dragenter' |
  'dragover' |
  'dragstart' |
  'drop' |
  'invalid' |
  'keydown' |
  'keypress' |
  'keyup' |
  'mousedown' |
  'mousemove' |
  'mouseout' |
  'mouseover' |
  'mouseup' |
  'pointerdown' |
  'pointermove' |
  'pointerout' |
  'pointerover' |
  'pointerup' |
  'reset' |
  'selectstart' |
  'submit' |
  'touchend' |
  'touchmove' |
  'touchstart' |
  'wheel'
  >

type CompositionEventMap = HTMLElementEventMap & {
  [P in keyof HTMLElementCancellableEventMap as `~${P}`]: Omit<HTMLElementCancellableEventMap[P], 'preventDefault'>
};

type CompositionEventListener<T, K = keyof CompositionEventMap> = {
  type?: K
  target?: ElementIdentifier,
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
  handleEvent?: (
      this: T,
      event: (K extends keyof CompositionEventMap ? CompositionEventMap[K] : Event) & {currentTarget:HTMLElement}
    ) => any;
  prop?: keyof T & string;
 };

type CompositionEventListenerObject<T> =
  {
    [P in keyof CompositionEventMap]?: (keyof T & string)
      | ((this: T, event: CompositionEventMap[P] & {currentTarget:HTMLElement}) => any)
      | CompositionEventListener<T, P>
  };