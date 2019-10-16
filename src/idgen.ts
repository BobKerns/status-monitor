// Copyright  by Bob Kerns. Licensed under MIT license

export class IdGenerator {
    static gens = {};
    static *idGenerator(start = 0) {
        let id = start;
        while (true) yield id++;
    }
    static id(prefix = "") {
        const gen = IdGenerator.gens[prefix]|| (IdGenerator.gens[prefix] = IdGenerator.idGenerator());
        const num = gen.next().value;
        if (prefix) {
            return `${prefix}-${num}`;
        }
        return num;
    }
}
