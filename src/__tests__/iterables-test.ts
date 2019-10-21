/**
 * @module StatusMonitor
 * Copyright © 2019 by Bob Kerns. Licensed under MIT license
 */

/**
 *
 */

import {isPossiblyIterator} from "../iterables";

function* testGen() {
    yield 5;
}

describe("Iterables", () =>{
   describe("isPossiblyIterator", () => {
       describe("Negative", () => {
           test("booleans", () => {
               expect(isPossiblyIterator(false)).toBe(false);
               expect(isPossiblyIterator(true)).toBe(false);
           });
           test('numbers', () => {
               expect(isPossiblyIterator(0)).toBe(false);
               expect(isPossiblyIterator(1)).toBe(false);
           });
           test('undefined', () => {
               expect(isPossiblyIterator(undefined)).toBe(false);
           });
           test("string", () => {
               expect(isPossiblyIterator("")).toBe(false);
               expect(isPossiblyIterator("longer string")).toBe(false);
           });
           test("Date", () => {
               expect(isPossiblyIterator(new Date())).toBe(false);
           });
           test("Function", () => {
               const funct = () => null;
               expect(() => isPossiblyIterator(funct)).toBe(false);
           });
           test("Generator Function", () => {
               expect(testGen).toBe(false);
           });
           test("Object", () => {
               expect(isPossiblyIterator({foo: "foo"})).toBe(false);
           });
           test("Object w/ non-functional next", () => {
               expect(isPossiblyIterator({next: "not-a-function"})).toBe(false);
           });
       });
       describe("Positive", () => {
           test("String iterator", () => {
               expect(isPossiblyIterator("foo"[Symbol.iterator]())).toBe(true);
           });
           test("Array iterator", () => {
               expect(isPossiblyIterator((["foo"][Symbol.iterator])())).toBe(true);
           });
           test("Generator", () => {
               expect(isPossiblyIterator(testGen())).toBe(true);
           });
           test("Object Iterator", () => {
               expect({
                   next() {
                       return {done: true};
                   }
               })
                   .toBe(true);
           });
           test("False Positive Lookalike", () => {
               expect({
                   next() {
                       return 17;
                   }
               });
           });
       });
   });
});
