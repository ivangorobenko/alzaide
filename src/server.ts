import {buildApp} from "./buildApp";
import {configureRepositories} from "./configureRepositories";
import {FileRepositories} from "./infrastructure/repository/fileRepositories";

const port = process.env.PORT || 8082;
const repositories: FileRepositories = configureRepositories();

const applicationToRun = buildApp(repositories);

applicationToRun.listen(port, () => console.log(`Alzaide est up sur le port ${port}`));
