// Copyright  by Bob Kerns. Licensed under MIT license

/**
 * Generator of ID values, either as a series of numbers, or in the form _prefix_-_number_.
 * If a prefix is used, each prefix will count a distinct series of numbers.
 */
export class IdGenerator {
    /**
     * The default instance for invocation as a static singleton.
     * */
    private static instance = new IdGenerator();
    private gens: {[k: string]: IterableIterator<number>} = {};
    private *idGenerator(start: number = 0) : IterableIterator<number> {
        let id = start;
        while (true) yield id++;
    }
    public id(prefix: string = "", separator: string = "-") : string | number {
        const gen = this.gens[prefix]|| (this.gens[prefix] = this.idGenerator());
        const num = gen.next().value;
        if (prefix) {
            return `${prefix}${separator}${num}`;
        }
        return num;
    }
    public static id(prefix: string = "", separator: string = "-") {
        return IdGenerator.instance.id(prefix, separator);
    }
}
