import {TacheQuotidienne} from "../../../domain/communication/agregat/TacheQuotidienne";
import {TacheQuotidienneRepository} from "../../../domain/communication/command/ValiderTacheQuotidienneCommandHandler";
import {readFile, syncPersistence} from "./file";

export class FileTacheQuotidienneRepository implements TacheQuotidienneRepository {
    private readonly filePath: string;
    protected readonly data: {[name: string]: TacheQuotidienne};

    constructor(path: string) {
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(typeTache: string, value: TacheQuotidienne): Promise<void> {
        this.data[typeTache] = value;
        return syncPersistence(this.filePath, this.data);
    }

    get(): TacheQuotidienne {
        return Object.values(this.data).find(message => message !== undefined) as TacheQuotidienne;
    }

    getAll(): TacheQuotidienne[] {
        return Object.values(this.data);
    }
}
