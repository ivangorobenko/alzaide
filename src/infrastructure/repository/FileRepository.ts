import {Repository} from "../../core/Repository";
import {copyFileIfNotExist, readFile, writeFile} from "./file";

export class FileRepository<T> implements Repository<T> {
    private readonly filePath: string;
    protected readonly data: {[name: string]: T};

    constructor(path: string, defaultPath = "") {
        copyFileIfNotExist(defaultPath, path);
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(id: string, value: T): Promise<void> {
        this.data[id] = value;
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
