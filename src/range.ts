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

/**
 * Take a sub range of a [[Sequence]], returning an Iterable. It is an error for `end` to be less than `start`;
 * @param seq A Sequence (Array or other Iterable, or an Iterator).
 * @param start The starting position for the subsequence.
 * @param end The end position for the subsequence. The subsequence ends immediately before this index. Infinity if no end.
 */
export function subseq<S extends Sequence>(seq: S, start: number = 0, end: number = Infinity) {
    const nEnd = end === Infinity ? Infinity : end - start;
    return limit(skip(seq, start), nEnd);
}

/**
 * Return an iterable gnerator of numbers between `start` and `end`, incrementing by `increment`.
 * The numbers do not need to be positive or integers.
 * @param start defaults to 0
 * @param end defaults to Infinity
 * @param increment defaults to 1
 */
export function range(start: number = 0, end: number = Infinity, increment: number = 1) {
    if (typeof start !== 'number') throw new Error(`Invalid start value: ${start}`);
    if (typeof end !== 'number') throw new Error(`Invalid end value: ${end}`);
    if (typeof increment !== 'number') throw new Error(`Invalid increment value: ${increment}`);
    function *rangeGenerator() {
        let i = start;
        if (increment > 0) {
            while (i < end) {
                yield i;
                i += increment;
            }
        } else {
            while (i > end) {
                yield i;
                i += increment;
            }
        }
        return i;
    }
    return rangeGenerator();
}
