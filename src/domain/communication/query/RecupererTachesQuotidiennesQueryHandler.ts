import {Query} from "../../../core/Query";
import {QueryHandler} from "../../../core/QueryHandler";
import {Result} from "../../../core/Result";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {TacheQuotidienneRepository} from "../command/ValiderTacheQuotidienneCommandHandler";

export const RECUPERER_TACHES_QUOTIDIENNES = "RECUPERER_TACHES_QUOTIDIENNES";

export class RecupererTachesQuotidiennesQueryHandler implements QueryHandler<TacheQuotidienne[]> {
    private tachesQuotidiennesRepository: TacheQuotidienneRepository;

    constructor(tachesQuotidiennesRepository: TacheQuotidienneRepository) {
        this.tachesQuotidiennesRepository = tachesQuotidiennesRepository;
    }

    handle(query: Query): Result<TacheQuotidienne[]> {
        return Result.ok(this.tachesQuotidiennesRepository.getAll());
    }

    typeOf(): string {
        return RECUPERER_TACHES_QUOTIDIENNES;
    }
}

export class RecupererTachesQuotidiennes extends Query {
    constructor() {
        super(RECUPERER_TACHES_QUOTIDIENNES);
    }
}
