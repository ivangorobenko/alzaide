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
import {
    InvaliderTachesQuotidiennes,
    InvaliderTachesQuotidiennesCommandHandler,
} from "./domain/communication/command/InvaliderTachesQuotidiennesCommandHandler";
import {LaisserMessageCommandHandler} from "./domain/communication/command/LaisserMessageCommandHandler";
import {SupprimerMessageCommandHandler} from "./domain/communication/command/SupprimerMessageCommandHandler";
import {ValiderTacheQuotidienneCommandHandler} from "./domain/communication/command/ValiderTacheQuotidienneCommandHandler";
import {RecupererAlerteLanceeQueryHandler} from "./domain/communication/query/RecupererAlerteLanceeQueryHandler";
import {RecupererMessagesQueryHandler} from "./domain/communication/query/RecupererMessagesQueryHandler";
import {RecupererTachesQuotidiennesQueryHandler} from "./domain/communication/query/RecupererTachesQuotidiennesQueryHandler";
import {configureCommunicationRoutes} from "./infrastructure/http/routes/communicationRoutes";
import {Repositories} from "./infrastructure/repository/Repositories";
import {UuidGenerator} from "./infrastructure/repository/UuidGenerator";
import {DummyMessagingService} from "./infrastructure/service/DummyMessagingService";

export const buildApp = (repositories: Repositories): Application => {
    const app = express();

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors({credentials: true, origin: true}));

    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));
    const timer = new Timer();

    const commandBus = new CommandBus();
    subscribeCommandsToHandlers(commandBus, repositories, timer);

    const queryBus = new QueryBus();
    subscribeQueriesToHandlers(queryBus, repositories);

    programTimelyCommands(commandBus, timer);
    app.use("/", configureCommunicationRoutes(commandBus, queryBus));

    return app;
};

const subscribeCommandsToHandlers = (commandBus: CommandBus, repositories: any, timer: Timer) => {
    commandBus.subscribe(new LaisserMessageCommandHandler(repositories.messageRepository, timer, new UuidGenerator()));
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
    commandBus.subscribe(new ValiderTacheQuotidienneCommandHandler(repositories.tacheQuotidienneRepository, timer));
    commandBus.subscribe(new InvaliderTachesQuotidiennesCommandHandler(repositories.tacheQuotidienneRepository, timer));
};

const subscribeQueriesToHandlers = (queryBus: QueryBus, repositories: any) => {
    queryBus.subscribe(new RecupererMessagesQueryHandler(repositories.messageRepository));
    queryBus.subscribe(new RecupererAlerteLanceeQueryHandler(repositories.alerteRepository));
    queryBus.subscribe(new RecupererTachesQuotidiennesQueryHandler(repositories.tacheQuotidienneRepository));
};

const programTimelyCommands = (commandBus: CommandBus, timer: Timer) => {
    const minute = 60000;
    timer.setInterval(() => commandBus.dispatch(new InvaliderTachesQuotidiennes()), minute);
};
