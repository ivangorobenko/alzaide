import {Event} from "../../core/Event";

export class MessageSupprimeEvent extends Event {
    constructor(id: string) {
        super(id);
    }
}