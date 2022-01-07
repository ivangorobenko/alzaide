import {Event} from "../../core/Event";

export class MessageLaisseEvent extends Event {
    constructor(id: string) {
        super(id);
    }
}
