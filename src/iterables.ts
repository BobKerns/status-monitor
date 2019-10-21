/**
 * @module StatusMonitor
 * Copyright © 2019 by Bob Kerns. Licensed under MIT license
 */

/**
 * Utilities for working with various type of iterables.
 */

/**
 * The constructor marking GeneratorFunction's
 */
const genFun = (function*(): IterableIterator<unknown> {});
const GeneratorFunction: GeneratorFunctionConstructor = Object.getPrototypeOf(genFun).constructor;
const genIter = (genFun)()[Symbol.iterator]();
const genIterProto = Object.getPrototypeOf(genIter);
const Generator: GeneratorFunction = genIterProto.constructor;

/**
 * Determine if an object can have arbitrary properties.  Type guard for {[a: string]: unknown}
 * @param obj
 */
export function isObjectLike(obj: unknown): obj is {[a: string]: unknown} {
    return obj && ((typeof obj === "object") || (typeof obj === "function"));
}

/**
 * Determine if an object appears to possibly implement the Iterable protocol. This is not definitive, but it is
 * useful because we usually will not be testing arbitrary objects, but rather a handful of known types. The user
 * is responsible for ensuring nothing bad happens if the object does not actually implement the ``Iterator`` protocol
 * despite having the right shape.
 * @param obj
 */
export function isPossiblyIterator<A>(obj: unknown): obj is Iterator<A> {
    if (isObjectLike(obj)) {
        if (typeof obj.next === 'function') {
            return true;
        }
    }
    return false;
}

/**
 * Determine if an object is in fact Iterable. A type guard. Unlike [[isPossiblyIterator]], the test is definitive.
 * @param obj
 */
export function isIterable<A>(obj: unknown): obj is Iterable<A> {
    if (isObjectLike(obj) || typeof obj === 'string') {
        let fn = (obj as any)[Symbol.iterator];
        return !!fn &&  typeof fn === 'function';
    }
    return false;
}
