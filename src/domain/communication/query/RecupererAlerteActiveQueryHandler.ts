import {Query} from "../../../core/Query";
import {QueryHandler} from "../../../core/QueryHandler";
import {Result} from "../../../core/Result";
import {Alerte} from "../agregat/Alerte";
import {AlerteRepository} from "../repository/AlerteRepository";

export const RECUPERER_ALERTES = "RECUPERER_ALERTES";

export class RecupererAlerteActiveQueryHandler implements QueryHandler<Alerte | string> {
    private alerteRepository: AlerteRepository;

    constructor(repository: AlerteRepository) {
        this.alerteRepository = repository;
    }

    handle(query: RecupererAlerteActiveQuery): Result<Alerte | string> {
        const alerte = this.alerteRepository.recupererAlerteActive();
        if (alerte) return Result.ok(alerte);
        return Result.fail("Aucune alerte active");
    }
}

export class RecupererAlerteActiveQuery extends Query {
    constructor() {
        super(RECUPERER_ALERTES);
    }
}
