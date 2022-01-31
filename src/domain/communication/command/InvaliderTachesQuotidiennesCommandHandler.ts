import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {Timer} from "../../../core/Timer";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {TacheQuotidienneInvalidee} from "../event/TacheQuotidienneInvalidee";
import {TacheQuotidienneRepository} from "./ValiderTacheQuotidienneCommandHandler";

export class InvaliderTachesQuotidiennesCommandHandler implements CommandHandler {
    private tachesQuotidiennesRepository: TacheQuotidienneRepository;
    private timer: Timer;

    constructor(tachesQuotidiennesRepository: TacheQuotidienneRepository, timer: Timer) {
        this.tachesQuotidiennesRepository = tachesQuotidiennesRepository;
        this.timer = timer;
    }

    handle(command: InvaliderTachesQuotidiennes): CommandResponse {
        if (!this.timer.isMidnight()) return Result.fail("NOT_MIDNIGHT");
        const taches = this.tachesQuotidiennesRepository.getAll();
        const tachesInvalide: TacheQuotidienne[] = [];
        taches.map(tache => tachesInvalide.push(TacheQuotidienne.invalider(tache, this.timer.now())));
        tachesInvalide.forEach(tache => this.tachesQuotidiennesRepository.save(tache.type, tache));
        const eventsList: TacheQuotidienneInvalidee[] = tachesInvalide.map(
            tache => new TacheQuotidienneInvalidee(tache.type)
        );
        return Result.ok(eventsList);
    }

    typeOf(): string {
        return INVALIDER_TACHES_QUOTIDIENNES;
    }
}

export const INVALIDER_TACHES_QUOTIDIENNES = "INVALIDER_TACHES_QUOTIDIENNES";

export class InvaliderTachesQuotidiennes extends Command {
    constructor() {
        super(INVALIDER_TACHES_QUOTIDIENNES);
    }
}
