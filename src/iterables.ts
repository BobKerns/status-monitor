/**
 * @module StatusMonitor
 * Copyright © 2019 by Bob Kerns. Licensed under MIT license
 */

/**
 * Utilities for working with various type of iterables.
 */

export type Element<T extends Sequence<unknown>> = T extends Iterator<infer E>
    ? E
    : T extends Iterable<infer E>
        ? E
        : never;
export type ToIterator<T extends Sequence> = Iterator<Element<T>>;
export type ToIterable<T extends Sequence> = Iterable<Element<T>>;

export type Sequence<E = any> = Iterator<E> | Iterable<E>;

export class IterableWrapper<I extends Sequence> implements ToIterable<I> {
    private readonly iter: ToIterator<I>;
    constructor(iter: ToIterator<I>) {
        this.iter = iter;
    }

    [Symbol.iterator](): ToIterator<I> { return this.iter; }
}

export function notIterable<R>(val: unknown): R {
    throw new TypeError(`Not an Iterator nor an Iterable: ${val}`);
}

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
 * despite having the right shape.å
 * @param obj
 */
export function isPossiblyIterator<E extends any, I extends Sequence<E>>(obj: any): obj is ToIterator<I> {
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
export function isIterable<E extends any, S extends Sequence<E>>(obj: any): obj is ToIterable<S> {
    if (isObjectLike(obj) || typeof obj === 'string') {
        let fn = (obj as any)[Symbol.iterator];
        return !!fn &&  typeof fn === 'function';
    }
    return false;
}

/**
 * Coerce a sequence (Iterable or Iterator) to an Iterable.
 * @param seq
 */
export function iterable<E extends any, S extends Sequence<E>>(seq: S): ToIterable<S> {
    if (isIterable<E,S>(seq)) {
        return seq;
    } else if (isPossiblyIterator<E,S>(seq)) {
        return new IterableWrapper(seq);
    }
    return notIterable(seq);
}

/**
 * Coerce a sequence of Iterator) to an Iterator.
 * @param seq
 */
export function iterator<E, S extends Sequence<E>>(seq: S): ToIterator<S> {
    if (isIterable<E,S>(seq)) {
        return seq[Symbol.iterator]() as ToIterator<S>;
    } else if (isPossiblyIterator<E,S>(seq)) {
        return seq;
    }
    return notIterable(seq);
}
