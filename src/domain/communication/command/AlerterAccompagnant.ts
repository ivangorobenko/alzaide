import {Command} from "../../../core/Command";
import {Lieu} from "../agregat/Alerte";

export class AlerterAccompagnant extends Command {
    constructor(readonly lieu: Lieu, readonly timestamp: number) {
        super("ALERTER_ACCOMPAGNANT");
    }
}
