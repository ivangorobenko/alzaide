import {Alerte} from "../../domain/communication/agregat/Alerte";
import {InformationAccompagnant} from "../../domain/communication/valueObject/InformationAccompagnant";
import {FileMessageRepository} from "./FileMessageRepository";
import {FileRepository} from "./FileRepository";

export type Repositories = {
    messageRepository: FileMessageRepository;
    alerteRepository: FileRepository<Alerte>;
    informationAccompagnantRepository: FileRepository<InformationAccompagnant>;
};
