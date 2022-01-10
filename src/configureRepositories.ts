import {FileAlerteRepository} from "./infrastructure/repository/file/FileAlerteRepository";
import {FileInformationAccompagnantRepository} from "./infrastructure/repository/file/FileInformationAccompagnantRepository";
import {FileMessageRepository} from "./infrastructure/repository/file/FileMessageRepository";
import {FileRepositories} from "./infrastructure/repository/Repositories";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";

export const configureRepositories = (): FileRepositories => ({
    messageRepository: new FileMessageRepository("./storage/dynamic/messages.json", new UuidGenerator()),
    alerteRepository: new FileAlerteRepository("./storage/dynamic/alertes.json", new UuidGenerator()),
    informationAccompagnantRepository: new FileInformationAccompagnantRepository(
        "./storage/configuration/informationAccompagnant.json",
        new UuidGenerator()
    ),
});
