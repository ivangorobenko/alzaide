import {Repository} from "./Repository";

export class InMemoryRepository<T> implements Repository {
    private readonly data: {[name: string]: T};

    constructor() {
        this.data = {};
    }
    async save(id: string, value: T): Promise<void> {
        this.data[id] = value;
    }
    
}
