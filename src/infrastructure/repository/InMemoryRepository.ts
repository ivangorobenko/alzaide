import {Repository} from "../../core/Repository";

export class InMemoryRepository<T> implements Repository<T> {
    private readonly data: {[name: string]: T};

    constructor() {
        this.data = {};
    }

    delete(key: string): void {
        if (this.data[key]) delete this.data[key];
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
