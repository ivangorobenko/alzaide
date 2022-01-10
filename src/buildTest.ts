import {buildApp} from "./buildApp";
import {InMemoryAlerteRepository} from "./infrastructure/repository/inMemory/InMemoryAlerteRepository";
import {InMemoryInformationAccompagnantRepository} from "./infrastructure/repository/inMemory/InMemoryInformationAccompagnantRepository";
import {InMemoryMessageRepository} from "./infrastructure/repository/inMemory/InMemoryMessageRepository";
import {InMemoryRepositories} from "./infrastructure/repository/Repositories";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";

const configureTestRepositories = (): InMemoryRepositories => ({
    messageRepository: new InMemoryMessageRepository(new UuidGenerator()),
    alerteRepository: new InMemoryAlerteRepository(new UuidGenerator()),
    informationAccompagnantRepository: new InMemoryInformationAccompagnantRepository(),
});

export const buildTest = () => {
    const repositories: InMemoryRepositories = configureTestRepositories();

    return {
        app: buildApp(repositories),
        repositories,
    };
};
