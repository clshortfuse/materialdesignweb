/** @typedef {'boolean'|'integer'|'float'|'string'|'map'|'set'|'array'} IDLOptionType */

/**
 * @template {IDLOptionType} T
 * @typedef {(
 *  T extends 'boolean' ? boolean
 *  : T extends 'string' ? string
 *  : T extends 'float'|'integer' ? number
 *  : T extends 'array' ? Array<?>
 *  : T extends 'set' ? Set<?>
 *  : T extends 'map' ? Map<?,?>
 *  : unknown
 * )} ParsedIDLType<T>
 */

/**
 * @template {IDLOptionType} T1
 * @template {any} T2
 * @typedef IDLOptions
 * @prop {T1} [type]
 * @prop {string} [attr]
 * @prop {boolean|'write'|'read'} [reflect=true]
 * @prop {boolean} [enumerable]
 * @prop {boolean} [nullable] Defaults to false if boolean
 * @prop {T2} [empty] Empty value when not nullable
 * @prop {(value: T2) => T2} [onNullish] Function used when null passed
 * @prop {T2} [default] Initial value (empty value if not specified)
 * @prop {boolean} [initialized]
 * @prop {WeakMap<CustomElement, T1>} [values]
 * @prop {WeakMap<CustomElement, string>} [attrValues]
 */

/**
 * @typedef RefOptions
 * @prop {string} id
 */

/**
 * @template T1
 * @template [T2=T1]
 * @callback HTMLTemplater
 * @param {TemplateStringsArray} strings
 * @param  {...(string|Element|((this:T1, data:T2) => any))} substitutions
 * @return {DocumentFragment}
 */

/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 * @template {any} T
 * @typedef {Object} BindEntry
 * @prop {string} id
 * @prop {number} nodeType
 * @prop {string} node
 * @prop {boolean} [negate]
 * @prop {Function} [fn]
 * @prop {Set<keyof T & string>} props
 * @prop {T} defaultValue
 */

/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 * @template {any} T
 * @typedef {Object} InlineFunctionEntry
 * @prop {(data:T) => any} fn
 * @prop {Set<keyof T & string>} [props]
 * @prop {T} [defaultValue]
 */

/**
 * @typedef {Object} EventEntry
 * @prop {string} type
 * @prop {EventListenerOptions} options
 * @prop {EventListener} [listener]
 * @prop {string} [prop]
 */

/**
 * @template T
 * @typedef {Map<keyof T, Set<BindEntry<T>>>} BindMap
 */

/**
 * @template T
 * @typedef {Map<string, InlineFunctionEntry<T>>} InlineFunctionMap
 */

/** @typedef {Map<string, Set<EventEntry>>} EventMap */
