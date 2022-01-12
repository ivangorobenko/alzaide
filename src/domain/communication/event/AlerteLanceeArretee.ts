import {Event} from "../../../core/Event";

export class AlerteLanceeArretee extends Event {
    constructor(alerteId: string) {
        super(alerteId);
    }
}
