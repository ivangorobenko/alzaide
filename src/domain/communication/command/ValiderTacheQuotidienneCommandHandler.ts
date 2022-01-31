import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {Result} from "../../../core/Result";
import {Timer} from "../../../core/Timer";
import {InMemoryTacheQuotidienneRepository} from "../../../infrastructure/repository/inMemory/InMemoryTacheQuotidienneRepository";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {TacheQuotidienneValidee} from "../event/TacheQuotidienneValidee";

export interface TacheQuotidienneRepository {
    get(typeTache: string): TacheQuotidienne;

    save(typeTache: string, value: TacheQuotidienne): void;

    getAll(): TacheQuotidienne[];
}

export const VALIDER_TACHE_QUOTIDIENNE = "VALIDER_TACHE_QUOTIDIENNE";

export class ValiderTacheQuotidienneCommandHandler implements CommandHandler {
    private tacheQuotidienneRepository: TacheQuotidienneRepository;
    private timer: Timer;

    constructor(tacheQuotidienneRepository: InMemoryTacheQuotidienneRepository, timer: Timer) {
        this.tacheQuotidienneRepository = tacheQuotidienneRepository;
        this.timer = timer;
    }

    handle(validerTacheQuotidienne: ValiderTacheQuotidienne): Result<TacheQuotidienneValidee | string> {
        const tacheQuotidienneAValider = this.tacheQuotidienneRepository.get(validerTacheQuotidienne.typeTache);
        if (!tacheQuotidienneAValider) return Result.fail("TACHE_N_EXISTE_PAS");
        const tacheQuotidienneValidee = TacheQuotidienne.valider(tacheQuotidienneAValider, this.timer.now());
        this.tacheQuotidienneRepository.save(validerTacheQuotidienne.typeTache, tacheQuotidienneValidee);
        return Result.ok(new TacheQuotidienneValidee(tacheQuotidienneValidee.type));
    }

    typeOf(): string {
        return VALIDER_TACHE_QUOTIDIENNE;
    }
}

export class ValiderTacheQuotidienne extends Command {
    readonly typeTache: string;

    constructor(typeTache: string) {
        super(VALIDER_TACHE_QUOTIDIENNE);
        this.typeTache = typeTache;
    }
}
