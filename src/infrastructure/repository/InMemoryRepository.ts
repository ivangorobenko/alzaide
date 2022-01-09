import {Repository} from "../../core/Repository";

export class InMemoryRepository<T> implements Repository<T> {
    protected readonly data: {[name: string]: T};

    constructor() {
        this.data = {};
    }

    save(key: string, value: T): void {
        this.data[key] = value;
    }

    getAll(): T[] {
        return Object.values(this.data);
    }

    get(key: string): T {
        return this.data[key];
    }
}
