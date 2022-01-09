import {Alerte} from "./domain/communication/agregat/Alerte";
import {InformationAccompagnant} from "./domain/communication/valueObject/InformationAccompagnant";
import {FileMessageRepository} from "./infrastructure/repository/FileMessageRepository";
import {FileRepositories} from "./infrastructure/repository/fileRepositories";
import {FileRepository} from "./infrastructure/repository/FileRepository";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";

export const configureRepositories = (): FileRepositories => ({
    messageRepository: new FileMessageRepository("./storage/dynamic/messages.json", new UuidGenerator()),
    alerteRepository: new FileRepository<Alerte>("./storage/dynamic/alertes.json", new UuidGenerator()),
    informationAccompagnantRepository: new FileRepository<InformationAccompagnant>(
        "./storage/configuration/informationAccompagnant.json",
        new UuidGenerator()
    ),
});
