import {Configuration} from "../../application/repos/Configuration";
import {ConfigRepository} from "./ConfigRepository";

export class InMemoryConfigRepository implements ConfigRepository {
    private readonly data: Configuration;

    constructor() {
        this.data = {};
    }

    delete(key: string): void {
        if (this.data[key]) delete this.data[key];
    }

    get(key: string): string {
        return this.data[key];
    }

    save(key: string, value: string): void {
        this.data[key] = value;
    }
}
