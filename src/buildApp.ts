import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {Application} from "express";
import logger from "morgan";
import path from "path";
import {CommandBus} from "./core/CommandBus";
import {QueryBus} from "./core/QueryBus";
import {Timer} from "./core/Timer";
import {AlerterAccompagnantCommandHandler} from "./domain/communication/command/AlerterAccompagnantCommandHandler";
import {ArreterAlerteLanceeCommandHandler} from "./domain/communication/command/ArreterAlerteLanceeCommandHandler";
import {LaisserMessageCommandHandler} from "./domain/communication/command/LaisserMessageCommandHandler";
import {SupprimerMessageCommandHandler} from "./domain/communication/command/SupprimerMessageCommandHandler";
import {
    RECUPERER_ALERTE_LANCEE,
    RecupererAlerteLanceeQueryHandler,
} from "./domain/communication/query/RecupererAlerteLanceeQueryHandler";
import {
    RECUPERER_MESSAGES,
    RecupererMessagesQueryHandler,
} from "./domain/communication/query/RecupererMessagesQueryHandler";
import {configureMessageRoutes} from "./infrastructure/http/routes/communicationRoutes";
import {Repositories} from "./infrastructure/repository/Repositories";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";
import {DummyMessagingService} from "./infrastructure/service/DummyMessagingService";

export const buildApp = (repositories: Repositories): Application => {
    const app = express();

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors({origin: false}));

    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    const commandBus = new CommandBus();
    subscribeCommandsToHandlers(commandBus, repositories);

    const queryBus = new QueryBus();
    subscribeQueriesToHandlers(queryBus, repositories);

    app.use("/", configureMessageRoutes(commandBus, queryBus));

    return app;
};

const subscribeCommandsToHandlers = (commandBus: CommandBus, repositories: any) => {
    commandBus.subscribe(
        new LaisserMessageCommandHandler(repositories.messageRepository, new Timer(), new UuidGenerator())
    );
    commandBus.subscribe(new SupprimerMessageCommandHandler(repositories.messageRepository));
    commandBus.subscribe(
        new AlerterAccompagnantCommandHandler(
            new DummyMessagingService(false),
            repositories.informationAccompagnantRepository,
            repositories.alerteRepository,
            new UuidGenerator()
        )
    );
    commandBus.subscribe(new ArreterAlerteLanceeCommandHandler(repositories.alerteRepository));
};

const subscribeQueriesToHandlers = (queryBus: QueryBus, repositories: any) => {
    queryBus.subscribe(RECUPERER_MESSAGES, new RecupererMessagesQueryHandler(repositories.messageRepository));
    queryBus.subscribe(RECUPERER_ALERTE_LANCEE, new RecupererAlerteLanceeQueryHandler(repositories.alerteRepository));
};
