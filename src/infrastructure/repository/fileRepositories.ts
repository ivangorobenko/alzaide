import {Alerte} from "../../domain/communication/agregat/Alerte";
import {InformationAccompagnant} from "../../domain/communication/valueObject/InformationAccompagnant";
import {FileMessageRepository} from "./FileMessageRepository";
import {FileRepository} from "./FileRepository";
import {InMemoryMessageRepository} from "./InMemoryMessageRepository";
import {InMemoryRepository} from "./InMemoryRepository";

export type Repositories = FileRepositories | InMemoryRepositories;

export type FileRepositories = {
    messageRepository: FileMessageRepository;
    alerteRepository: FileRepository<Alerte>;
    informationAccompagnantRepository: FileRepository<InformationAccompagnant>;
};

export type InMemoryRepositories = {
    messageRepository: InMemoryMessageRepository;
    alerteRepository: InMemoryRepository<Alerte>;
    informationAccompagnantRepository: InMemoryRepository<InformationAccompagnant>;
};
