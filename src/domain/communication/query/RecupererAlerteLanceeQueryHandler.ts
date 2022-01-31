import {Query} from "../../../core/Query";
import {QueryHandler} from "../../../core/QueryHandler";
import {Result} from "../../../core/Result";
import {Alerte} from "../agregat/Alerte";
import {AlerteRepository} from "../repository/AlerteRepository";

export const RECUPERER_ALERTE_LANCEE = "RECUPERER_ALERTE_LANCEE";

export class RecupererAlerteLanceeQueryHandler implements QueryHandler<Alerte | string> {
    private alerteRepository: AlerteRepository;

    constructor(repository: AlerteRepository) {
        this.alerteRepository = repository;
    }

    handle(query: RecupererAlerteLancee): Result<Alerte | string> {
        const alerte = this.alerteRepository.recupererAlerteLancee();
        if (alerte) return Result.ok(alerte);
        return Result.fail("Aucune alerte active");
    }

    typeOf(): string {
        return RECUPERER_ALERTE_LANCEE;
    }
}

export class RecupererAlerteLancee extends Query {
    constructor() {
        super(RECUPERER_ALERTE_LANCEE);
    }
}
