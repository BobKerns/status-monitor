/**
 * @module StatusMonitor
 * Copyright © 2019 by Bob Kerns. Licensed under MIT license
 */

import {limit, skip, toArray} from "../range";
import {Sequence} from "../iterables";

/**
 * Tests of the range utilities.
 */

function *testGen() {
    yield 5;
    yield "foo";
    yield 3;
    return null;
}

describe("Range Tests", () => {
    const ar = [7, "bar", true];
    // test toArray first, so we can use it in other tests.
    describe('toArray', () => {
        describe("Full Array", () => {
            test("Array->Array", () =>
                expect(toArray(ar))
                    .toEqual(ar));
            test("Array is copied", () =>
                expect(toArray(ar)).not.toBe(ar));
            test("iterator", () =>
                expect(toArray(testGen()))
                    .toEqual([...testGen()]));
        });
        describe("Excess count", () => {
            test("Array->Array", () =>
                expect(toArray(ar, 100))
                    .toEqual(ar));
            test("iterator", () =>
                expect(toArray(testGen(), 100))
                    .toEqual([...testGen()]));
        });
        // Verify supplying a maximum length.
        describe("Truncated Array", () => {
            test("Array->Array", () =>
                expect(toArray([5, "foo", false], 2))
                    .toEqual([5, "foo"]));
            test("iterator", () =>
                expect(toArray(testGen(), 2))
                    .toEqual([5, "foo"]));
        });
        // Verify the 0-length edge cases.
        describe("Empty Array", () => {
            test("Array->Array", () =>
                expect(toArray([5, "foo", false], 0))
                    .toEqual([]));
            test("iterator", () =>
                expect(toArray(testGen(), 0))
                    .toEqual([]));
            test("Empty", () =>
                expect(toArray([]))
                    .toEqual([]));
            test("Empty max 0", () =>
                expect(toArray([], 0))
                    .toEqual([]));
            test("Empty max 100", () =>
                expect(toArray([], 100))
                    .toEqual([]));
        });
        describe("Error cases", () => {
            test("Negative size", () =>
                expect(() => toArray([], -1))
                    .toThrow());
            test("Non-number", () =>
                expect(() => toArray([], null as unknown as number))
                    .toThrow());
            test("Non-integer", () =>
                expect(() => toArray([], 3.14159))
                    .toThrow());
        });
    });
    // Test skip
    describe("skip", () => {
        const skipTest = (v: Sequence, count: number, val: Array<any>) =>
            () =>
                expect(toArray(skip(v, count)))
                    .toEqual(val);
        test("Array skip 0", skipTest(ar, 0, ar));
        test("Array skip empty 0", skipTest([], 0, []));
        test("Array skip 2", skipTest(ar, 2, [ar[2]]));
        test("Array skip empty", skipTest(ar, 3, []));
        test("Array skip excess", skipTest(ar, 7, []));() => {
            test("Negative size", () =>
                expect(() => skip([], -1))
                    .toThrow());
            test("Non-number", () =>
                expect(() => skip([], null as unknown as number))
                    .toThrow());
            test("Non-integer", () =>
                expect(() => skip([], 3.14159))
                    .toThrow());
        };
    });
    // Test limit
    describe("limit", () => {
        const limitTest = (v: Sequence, count: number, val: Array<any>) =>
            () =>
                expect(toArray(limit(v, count)))
                    .toEqual(val);
        test("Unlimited", () =>
            expect(limit(ar)).toEqual(ar));
        test("Larger", limitTest(ar, 100, ar));
        test("Equal", limitTest(ar, ar.length, ar));
        test("Smaller", limitTest(ar, 2, [ar[0], ar[1]]));
        test("Zero", limitTest(ar, 0, []));
        describe("Error cases", () => {
            test("Negative size", () =>
                expect(() => limit([], -1))
                    .toThrow());
            test("Non-number", () =>
                expect(() => limit([], null as unknown as number))
                    .toThrow());
            test("Non-integer", () =>
                expect(() => limit([], 3.14159))
                    .toThrow());
        });
    });
});
