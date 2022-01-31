import {Alerte} from "../../domain/communication/agregat/Alerte";
import {FileAlerteRepository} from "./file/FileAlerteRepository";
import {FileInformationAccompagnantRepository} from "./file/FileInformationAccompagnantRepository";
import {FileMessageRepository} from "./file/FileMessageRepository";
import {FileTacheQuotidienneRepository} from "./file/FileTacheQuotidienneRepository";
import {InMemoryInformationAccompagnantRepository} from "./inMemory/InMemoryInformationAccompagnantRepository";
import {InMemoryMessageRepository} from "./inMemory/InMemoryMessageRepository";
import {InMemoryRepository} from "./inMemory/InMemoryRepository";
import {InMemoryTacheQuotidienneRepository} from "./inMemory/InMemoryTacheQuotidienneRepository";

export type Repositories = FileRepositories | InMemoryRepositories;

export type FileRepositories = {
    messageRepository: FileMessageRepository;
    alerteRepository: FileAlerteRepository;
    informationAccompagnantRepository: FileInformationAccompagnantRepository;
    tacheQuotidienneRepository: FileTacheQuotidienneRepository;
};

export type InMemoryRepositories = {
    messageRepository: InMemoryMessageRepository;
    alerteRepository: InMemoryRepository<Alerte>;
    informationAccompagnantRepository: InMemoryInformationAccompagnantRepository;
    tacheQuotidienneRepository: InMemoryTacheQuotidienneRepository;
};
