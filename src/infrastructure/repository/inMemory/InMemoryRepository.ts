import {Repository} from "../../../core/Repository";
import {IdGenerator} from "../../../domain/communication/repository/IdGenerator";

export class InMemoryRepository<T> implements Repository<T> {
    protected readonly data: {[name: string]: T};
    protected idGenerator: any;

    constructor(idGenerator: IdGenerator) {
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
