import {Result} from "../../../core/Result";
import {Timer} from "../../../core/Timer";
import {InMemoryTacheQuotidienneRepository} from "../../../infrastructure/repository/inMemory/InMemoryTacheQuotidienneRepository";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {TacheQuotidienneValidee} from "../event/TacheQuotidienneValidee";

export class ValiderTacheQuotidienneCommandHandler {
    private tacheQuotidienneRepository: InMemoryTacheQuotidienneRepository;
    private timer: Timer;

    constructor(tacheQuotidienneRepository: InMemoryTacheQuotidienneRepository, timer: Timer) {
        this.tacheQuotidienneRepository = tacheQuotidienneRepository;
        this.timer = timer;
    }

    handle(validerTacheQuotidienne: ValiderTacheQuotidienne): Result<TacheQuotidienneValidee | string> {
        const tacheQuotidienneAValider = this.tacheQuotidienneRepository.get(validerTacheQuotidienne.type);
        const tacheQuotidienneValidee = TacheQuotidienne.valider(tacheQuotidienneAValider, this.timer.now());
        this.tacheQuotidienneRepository.save(validerTacheQuotidienne.type, tacheQuotidienneValidee);
        return Result.ok(new TacheQuotidienneValidee(tacheQuotidienneValidee.type));
    }
}

export class ValiderTacheQuotidienne {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}
