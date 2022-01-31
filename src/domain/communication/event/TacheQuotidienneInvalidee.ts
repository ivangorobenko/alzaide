import {Event} from "../../../core/Event";

export class TacheQuotidienneInvalidee extends Event {
    constructor(typeTache: string) {
        super(typeTache);
    }
}
