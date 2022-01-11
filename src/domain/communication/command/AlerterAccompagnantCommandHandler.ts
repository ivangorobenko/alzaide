import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {Alerte} from "../agregat/Alerte";
import {AccompagnantAlerte} from "../event/AccompagnantAlerte";
import {AlerteRepository} from "../repository/AlerteRepository";
import {IdGenerator} from "../repository/IdGenerator";
import {InformationAccompagnantRepository} from "../repository/InformationAccompagnantRepository";
import {MessagingService} from "../service/MessagingService";
import {Lieu} from "../valueObject/Lieu";

export const ALERTER_ACCOMPAGNANT = "ALERTER_ACCOMPAGNANT";

export class AlerterAccompagnantCommandHandler implements CommandHandler {
    private messagingService: MessagingService;
    private informationAccompagnantRepository: InformationAccompagnantRepository;
    private alertRepository: AlerteRepository;
    private idGenerator: IdGenerator;

    constructor(
        messagingService: MessagingService,
        informationAccompagnantRepository: InformationAccompagnantRepository,
        alertRepository: AlerteRepository,
        idGenerator: any
    ) {
        this.messagingService = messagingService;
        this.informationAccompagnantRepository = informationAccompagnantRepository;
        this.alertRepository = alertRepository;
        this.idGenerator = idGenerator;
    }

    handle(command: AlerterAccompagnant): CommandResponse {
        const alerteActive = this.alertRepository.recupererAlerteActive();
        if (alerteActive) return Result.fail("Il y a déjà une alerte active");

        const alerte = Alerte.lancer(this.idGenerator.generate(), command.lieu, command.timestamp);

        this.alertRepository.save(alerte);

        const telephoneAccompagnant: string =
            this.informationAccompagnantRepository.recupererNumeroTelephoneAccompagnant();
        const isSMSSent = this.messagingService.sendSMS(telephoneAccompagnant, "Alerte !!!");
        if (isSMSSent) return Result.ok(new AccompagnantAlerte(alerte.alerteId));
        return Result.fail("Alerte n'a pas pu être envoyée");
    }

    typeOf(): string {
        return ALERTER_ACCOMPAGNANT;
    }
}

export class AlerterAccompagnant extends Command {
    constructor(readonly lieu: Lieu, readonly timestamp: number) {
        super(ALERTER_ACCOMPAGNANT);
    }
}
