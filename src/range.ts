/**
 * @module statusMonitor
 * Copyright © 20190 by Bob Kerns. MIT License.
 */

import {isIterable, isPossiblyIterator, iterable, Element, iterator, notIterable, ToIterable, ToIterator, Sequence} from "./iterables";

/**
 * Utilities for returning a range.
 */

/**
 * Given an [[Iterable]] or [[Iterator]], and a number of entries to skip, return an Iterator that has skipped that many entries.
 * @param seq An [[Iterable]] or [[Iterator]]
 * @param count The number of entries to skip. Must be >= 0.
 */
export function skip<S extends Sequence>(seq: S, count: number = Infinity): ToIterable<S> {
    if (count < 0 || !Number.isInteger(count)) throw new Error(`Invalid maxSize: ${{count}}`);
    if (count === 0) {
        return iterable(seq);
    }
    const iter = iterator(seq);
    for (let i = 0; i < count; i++) {
        const r = iter.next();
        if (r.done) {
            return iterable(iter);
        }
    }
    return iterable(iter);
}

/**
 * Truncate a sequence (Iterable or Iterator) to `maxSize` elements.
 * @param seq
 * @param maxSize
 */
export function limit<S extends Sequence>(seq: S, maxSize: number = Infinity): ToIterable<S> {
    // Do the error check first, then make the generator.
    if (maxSize === Infinity) {
        return iterable(seq);
    }
    if (maxSize < 0 || !Number.isInteger(maxSize)) throw new Error(`Invalid maxSize: ${{maxSize}}`);
    function *doLimit(seq: S, maxSize: number): ToIterable<S> {
        let done = false;
        const iter = iterator(seq);
        for (let i = 0; i < maxSize; i++) {
            const v = iter.next();
            const value = v.value;
            done = done || v.done;
            if (!done) {
                yield value;
            } else {
                return value;
            }
        }
    }
    return doLimit(seq, maxSize);
}

/**
 * Convert a sequence to an array. An optional *maxSize* parameter limits the size
 * @param seq
 * @param maxSize
 */
export function toArray<S extends Sequence>(seq: S, maxSize: number = Infinity): Array<Element<S>> {
    if (maxSize === Infinity) {
        return [...iterable(seq)];
    }
    return toArray(limit(seq, maxSize));
}
