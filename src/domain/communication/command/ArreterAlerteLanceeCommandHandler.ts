import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {AlerteLanceeArretee} from "../event/AlerteLanceeArretee";
import {AlerteRepository} from "../repository/AlerteRepository";

export const ARRETER_ALERTE_LANCEE = "ARRETER_ALERTE_LANCEE";

export class ArreterAlerteLanceeCommandHandler implements CommandHandler {
    private alerteRepository: AlerteRepository;

    constructor(alerteRepository: AlerteRepository) {
        this.alerteRepository = alerteRepository;
    }

    handle(command: ArreterAlerteLancee): CommandResponse {
        const alerteLancee = this.alerteRepository.recupererAlerteLancee();
        if (alerteLancee === undefined) return Result.fail("Aucune alerte lancee");
        const alerteLanceeArretee = alerteLancee?.arreter();
        this.alerteRepository.save(alerteLanceeArretee);
        return Result.ok(new AlerteLanceeArretee(alerteLanceeArretee.id));
    }

    typeOf(): string {
        return ARRETER_ALERTE_LANCEE;
    }
}

export class ArreterAlerteLancee extends Command {
    constructor() {
        super(ARRETER_ALERTE_LANCEE);
    }
}
