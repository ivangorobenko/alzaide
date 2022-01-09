import {Repository} from "../../core/Repository";
import {readFile, writeFile} from "./file";

export class FileRepository<T> implements Repository<T> {
    private readonly filePath: string;
    protected readonly data: {[name: string]: T};
    protected idGenerator: any;

    constructor(path: string, idGenerator: any) {
        this.idGenerator = idGenerator;
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(value: T): Promise<void> {
        this.data[this.idGenerator.generate()] = value;
        return this.syncPersistence();
    }

    async syncPersistence(): Promise<void> {
        writeFile(this.filePath, this.data);
    }

    getAll(): T[] {
        return Object.values(this.data).filter(message => message !== undefined);
    }

    get(id: string): T {
        return this.data[id];
    }
}
