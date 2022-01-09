import {idGenerator} from "../../../../test/FakeIdGenerator";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {Alerte} from "../agregat/Alerte";
import {AccompagnantAlerte} from "../event/AccompagnantAlerte";
import {AlerteRepository} from "../repository/AlerteRepository";
import {InformationAccompagnantRepository} from "../repository/InformationAccompagnantRepository";
import {MessagingService} from "../service/MessagingService";
import {InformationAccompagnant} from "../valueObject/InformationAccompagnant";
import {AlerterAccompagnant} from "./AlerterAccompagnant";

export class AlerterAccompagnantHandler implements CommandHandler {
    private messagingService: MessagingService;
    private configRepository: InformationAccompagnantRepository;
    private alertRepository: AlerteRepository;
    private idGenerator: any;
    constructor(
        messagingService: MessagingService,
        configRepository: InformationAccompagnantRepository,
        alertRepository: AlerteRepository,
        idGenerator: any
    ) {
        this.messagingService = messagingService;
        this.configRepository = configRepository;
        this.alertRepository = alertRepository;
        this.idGenerator = idGenerator;
    }
    handle(command: AlerterAccompagnant): CommandResponse {
        const alerte = Alerte.lancer(idGenerator.generate(), command.lieu, command.timestamp);

        this.alertRepository.save(alerte.alerteId, alerte); // TODO : refactor pour sauvegarder juste alerte sans id. Id doit être géré côté repository

        const informationAccompagnant: InformationAccompagnant = this.configRepository.getAll()[0];
        const isSMSSent = this.messagingService.sendSMS(informationAccompagnant.telephone, "Alerte !!!");
        if (isSMSSent) return Result.ok(new AccompagnantAlerte(alerte.alerteId));
        return Result.fail("Alerte n'a pas pu être envoyée");
    }
}
