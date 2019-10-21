/**
 * @module StatusMonitor
 * Copyright © 2019 by Bob Kerns. Licensed under MIT license
 */

/**
 *
 */

import {isIterable, isObjectLike, isPossiblyIterator} from "../iterables";
import DateTimeFormat = Intl.DateTimeFormat;

// A simple generator function.
function* testGen() {
    yield 5;
}

/**
 * Check multiple values for true or false result with a single call.
 */
interface BulkChecks {
    truthy: (...vals: any[]) => () => void;
    falsy: (...vals: any[]) => () => void;
}

/**
 * Produce truthy/falsy [[BulkChecks]] for a function under test.
 * @param fn The function under test.
 */
const testPredicates = (fn: (v: unknown) => boolean): BulkChecks => {
    const truthy = (...vals: any[]) => () => { vals.forEach(v => expect(fn(v)).toBeTruthy()); }
    const falsy = (...vals: any[]) => () => { vals.forEach(v => expect(fn(v)).toBeFalsy()); }
    return {truthy, falsy};
};

describe("Iterable Checks", () =>{
    describe("isObjectLike", () => {
        const {falsy, truthy} = testPredicates(isObjectLike);
        describe("Negative", () => {
            test("Number", falsy(10, 0, -1, 3.5));
            test("Booleans", falsy(true, false));
            // Strings are not sufficiently object-like in actual behavior.
            test("Strings", falsy("", "longer string"));
        });
        describe("Positive", () => {
            test("Objects", truthy({}, {foo: 17}, [], ["foo"]));
            test("Instances", truthy(new Date(), /regex/, new Map(), new Set(), Math, Date, DateTimeFormat));
            test("Functions", truthy(() => null, truthy, falsy));
        });
    });
   describe("isPossiblyIterator", () => {
       const {falsy, truthy} = testPredicates(isPossiblyIterator);
       describe("Negative", () => {
           test("booleans", falsy(true, false));
           test('numbers', falsy(10, 0, -1, 3.5));
           test('undefined', falsy(undefined, null));
           test("string", falsy("", "longer string"));
           test("Date", falsy(new Date()));
           test("Function", falsy(() => null));
           test("Generator Function", falsy(testGen));
           test("Object", falsy({}, {foo: "foo"}));
           test("Object w/ non-functional next", falsy({next: "not-a-function"}));
       });
       describe("Positive", () => {
           test("String iterator", truthy(""[Symbol.iterator](), "foo"[Symbol.iterator]()));
           test("Array iterator", truthy([][Symbol.iterator](), ["foo"][Symbol.iterator]()));
           test("Generator", truthy(testGen()));
           test("Object Iterator", truthy({
               next() {
                   return {done: true};
               }
           }));
           test("False Positive Lookalike", truthy({
               next() {
                   return 17;
               }
           }));
       });
   });
   describe("isIterable", () => {
       const {falsy, truthy} = testPredicates(isIterable);
       describe('Negative', () => {
           test('Booleans', falsy(false, true));
           test('numbers', falsy(10, 0, -1, 3.5));
           test('undefined', falsy(undefined, null));
           test('Date', falsy(new Date()));
           test('Function', falsy(() => null, falsy, truthy));
           test('Object', falsy({}, {foo: 5}));
           test('Object w/ next', falsy({next: () => null}));
           test("Simple Object Iterator", falsy({
               next() {
                   return {done: true};
               }
           }));
       });
       describe('Positive', () => {
           test('Object keys', truthy(Object.keys({}), Object.keys({foo: 17, bar: "baz"})));
           test('Object values', truthy(Object.values({}), Object.keys({foo: 17, bar: "baz"})));
           test("Arrays", truthy([], ["foo"]));
           test("String", truthy("", "longer string"));
           test("String iterator", truthy(""[Symbol.iterator](), "foo"[Symbol.iterator]()));
           test("Array iterator", truthy([][Symbol.iterator](), ["foo"][Symbol.iterator]()));
           test("Generator", truthy());
           test('Generator Function', truthy(testGen()));
           test("Iterable Iterator", truthy({
               [Symbol.iterator]: function () { return this; },
               next() {
                   return {done: true};
               }
           }));
       });
   });
});
