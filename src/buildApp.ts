import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {Application} from "express";
import logger from "morgan";
import path from "path";
import {CommandBus} from "./core/CommandBus";
import {QueryBus} from "./core/QueryBus";
import {Timer} from "./core/Timer";
import {
    LAISSER_MESSAGE,
    LaisserMessageCommandHandler,
} from "./domain/communication/command/LaisserMessageCommandHandler";
import {
    SUPPRIMER_MESSAGE,
    SupprimerMessageCommandHandler,
} from "./domain/communication/command/SupprimerMessageCommandHandler";
import {
    RECUPERER_MESSAGES,
    RecupererMessagesQueryHandler,
} from "./domain/communication/query/RecupererMessagesQueryHandler";
import {configureMessageRoutes} from "./infrastructure/http/routes/messageRoutes";
import {FileMessageRepository} from "./infrastructure/repository/FileMessageRepository";
import {Repositories} from "./infrastructure/repository/repositories";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";

export const buildApp = (): Application => {
    const app = express();

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors({credentials: true, origin: true}));

    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    const repositories: Repositories = configureRepositories();

    const commandBus = new CommandBus();
    subscribeCommandsToHandlers(commandBus, repositories);

    const queryBus = new QueryBus();
    subscribeQueriesToHandlers(queryBus, repositories);

    app.use("/", configureMessageRoutes(commandBus, queryBus));

    return app;
};

const configureRepositories = () => ({
    messageRepository: new FileMessageRepository("./storage/messages.json", new UuidGenerator()),
});

const subscribeCommandsToHandlers = (commandBus: CommandBus, repositories: any) => {
    commandBus.subscribe(
        LAISSER_MESSAGE,
        new LaisserMessageCommandHandler(repositories.messageRepository, new Timer(), new UuidGenerator())
    );
    commandBus.subscribe(SUPPRIMER_MESSAGE, new SupprimerMessageCommandHandler(repositories.messageRepository));
};

const subscribeQueriesToHandlers = (queryBus: QueryBus, repositories: any) => {
    queryBus.subscribe(RECUPERER_MESSAGES, new RecupererMessagesQueryHandler(repositories.messageRepository));
};
