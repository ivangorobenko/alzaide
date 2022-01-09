import {Repository} from "../../core/Repository";

export class InMemoryRepository<T> implements Repository<T> {
    protected readonly data: {[name: string]: T};
    private idGenerator: any;

    constructor(idGenerator: any) {
        this.idGenerator = idGenerator;
        this.data = {};
    }

    save(value: T): void {
        this.data[this.idGenerator.generate()] = value;
    }

    getAll(): T[] {
        return Object.values(this.data);
    }

    get(id: string): T {
        return this.data[id];
    }
}
