/**
 * @module statusMonitor
 * Copyright © 20190 by Bob Kerns. MIT License.
 */

/**
 * Provide event distribution services. Events published with {@link EventDistributor#notify} are delivered to every
 */
export class EventDistributor {
    private done: boolean = false;
    private watcherCount: number = 0;
    private readCount: number = 0;
    private waitCount: number = 0;
    private notifyCount: number = 0;
    private promise?: Promise<any>;
    private accept?: (v: any) => void;
    constructor() {
        this.newPromise();
    }
    private newPromise() {
        this.promise = new Promise<any>(accept => this.accept = accept)
            .then(v => {
                this.newPromise();
                return v;
            });
    }
    async next() {
        try {
            this.waitCount++;
            const v = await this.promise;
            this.readCount++;
            return {
                value: v,
                done: this.done
            };
        } finally {
            --this.waitCount;
        }
    }
    public notify(event: any): void {
        this.notifyCount++;
        this.accept && this.accept(event);
    }

    public end() {
        this.done = true;
        this.notify(undefined);
    }

    public async *watcher() {
        this.watcherCount++;
        const eq = this;
        while (!eq.done) {
            const v = await eq.next();
            if (v.done) {
                eq.done = true;
            } else {
                yield v.value;
            }
        }
    }
}
