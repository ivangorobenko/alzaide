import {TacheQuotidienne} from "../../../domain/communication/agregat/TacheQuotidienne";

export class InMemoryTacheQuotidienneRepository {
    protected readonly data: {[tache: string]: TacheQuotidienne};

    constructor() {
        this.data = {};
    }

    get(tache: string) {
        return this.data[tache];
    }

    save(tache: string, value: TacheQuotidienne): void {
        this.data[tache] = value;
    }

    getAll() {
        return Object.values(this.data);
    }
}
