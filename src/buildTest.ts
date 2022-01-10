import {buildApp} from "./buildApp";
import {Alerte} from "./domain/communication/agregat/Alerte";
import {InformationAccompagnant} from "./domain/communication/valueObject/InformationAccompagnant";
import {InMemoryMessageRepository} from "./infrastructure/repository/InMemoryMessageRepository";
import {InMemoryRepository} from "./infrastructure/repository/InMemoryRepository";
import {InMemoryRepositories} from "./infrastructure/repository/Repositories";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";

const configureTestRepositories = (): InMemoryRepositories => ({
    messageRepository: new InMemoryMessageRepository(new UuidGenerator()),
    alerteRepository: new InMemoryRepository<Alerte>(new UuidGenerator()),
    informationAccompagnantRepository: new InMemoryRepository<InformationAccompagnant>(new UuidGenerator()),
});

export const buildTest = () => {
    const repositories: InMemoryRepositories = configureTestRepositories();

    return {
        app: buildApp(repositories),
        repositories,
    };
};
