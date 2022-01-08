import {Command} from "../../../core/Command";
import {CommandHandler} from "../../../core/CommandHandler";
import {CommandResponse} from "../../../core/CommandResponse";
import {Result} from "../../../core/Result";
import {ConfigRepository} from "../../../infrastructure/repository/ConfigRepository";
import {AccompagnantAlerte} from "../event/AccompagnantAlerte";
import {MessagingService} from "../service/MessagingService";

export class AlerterAccompagnantHandler implements CommandHandler {
    private messagingService: MessagingService;
    private configRepository: ConfigRepository;
    constructor(messagingService: MessagingService, configRepository: ConfigRepository) {
        this.messagingService = messagingService;
        this.configRepository = configRepository;
    }
    handle(command: Command): CommandResponse {
        const telephone = this.configRepository.get("telephone");
        const smsId = this.messagingService.sendSMS(telephone, "Alerte !!!");
        if (smsId) return Result.ok(new AccompagnantAlerte(smsId));
        return Result.fail("Alerte n'a pas pu être envoyée");
    }
}
