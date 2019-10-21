/**
 * @module statusMonitor
 * Copyright © 20190 by Bob Kerns. MIT License.
 */

import {isIterable, isPossiblyIterator} from "./iterables";

/**
 * Utilities for returning a range.
 */

class IterableWrapper<E> implements Iterable<E> {
    private iter: Iterator<E>;
    constructor(iter: Iterator<E>) {
        this.iter = iter;
    }

    [Symbol.iterator]() { return this.iter; }
}

function notIterable<R>(val: unknown): R {
    throw new TypeError(`Not an Iterator nor an Iterable: ${val}`);
}

export function iterable<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I): Iterable<E>;
export function iterable<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: S): Iterable<E>;
export function iterable<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S): Iterable<E>;
export function iterable<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S): Iterable<E> {
    if (isIterable(seq)) {
        return seq;
    } else if (isPossiblyIterator(seq)) {
        return new IterableWrapper(seq);
    }
    return notIterable(seq);
}

export function iterator<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I): Iterator<E>;
export function iterator<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: S): Iterator<E>;
export function iterator<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S): Iterator<E>;
export function iterator<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S): Iterator<E> {
    if (isIterable(seq)) {
        return seq[Symbol.iterator]();
    } else if (isPossiblyIterator(seq)) {
        return seq;
    }
    return notIterable(seq);
}

/**
 * Given an [[Iterable]] or [[Iterator]], and a number of entries to skip, return an Iterator that has skipped that many entries.
 * @param seq An [[Iterable]] or [[Iterator]]
 * @param count The number of entries to skip. Must be >= 0.
 */
export function skip<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: S, count: number): Iterable<E>;
export function skip<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I, count: number): Iterable<E>;
export function skip<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S, count: number): Iterable<E>;
export function skip<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S, count: number): Iterable<E> {
    if (count < 0) {
        throw new RangeError(`Skip count negative: ${count}`);
    }
    if (isPossiblyIterator(seq)) {
        for (let i = 0; i < count; i++) {
            const r = seq.next();
            if (r.done) {
                return iterable(seq);
            }
        }
    }
    if (isIterable(seq)) {
        const iter: I = seq[Symbol.iterator]() as I;
        return skip<E, S, I>(iter, count);
    }
    return notIterable(seq);
}

/**
 * Convert a sequence to an array. An optional *maxSize* parameter limits the size
 * @param seq
 * @param maxSize
 */
export function toArray<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: S, maxSize?: number): Array<E>;
export function toArray<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I, maxSize?: number): Array<E>;
export function toArray<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S, maxSize: number = Infinity): Array<E> {
    if (maxSize === Infinity) {
        return [...iterable<E, S, I>(seq)];
    }
    return toArray(limit<E>(seq, maxSize));
}


export function limit<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: S, maxSize?: number): Array<E>;
export function limit<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I, maxSize?: number): Array<E>;
export function limit<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S, maxSize: number): Iterable<E>;
export function *limit<E, S extends Iterable<E> = Iterable<E>, I extends Iterator<E> = Iterator<E>>(seq: I | S, maxSize: number = Infinity): Iterable<E> {
    let done = false;
    let value: E | undefined = undefined;
    const iter = iterator<E>(seq);
    while (!done) {
        const v = iter.next();
        value = v.value;
        done = done || v.done;
        if (!done) {
            yield value;
        }
    }
    return value;
}
