import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {Application} from "express";
import logger from "morgan";
import path from "path";
import {IdGenerator} from "./application/IdGenerator";
import {CommandBus} from "./core/CommandBus";
import {QueryBus} from "./core/QueryBus";
import {Timer} from "./core/Timer";
import {LAISSER_MESSAGE, LaisserMessageCommandHandler} from "./domain/command/LaisserMessageCommandHandler";
import {SUPPRIMER_MESSAGE, SupprimerMessageCommandHandler} from "./domain/command/SupprimerMessageCommandHandler";
import {RECUPERER_MESSAGES, RecupererMessagesQueryHandler} from "./domain/query/RecupererMessagesQueryHandler";
import {configureMessageRoutes} from "./infrastructure/http/routes/messageRoutes";
import {MessageRepositoryImpl} from "./infrastructure/repository/MessageRepositoryImpl";

export const buildApp = (): Application => {
    const app = express();

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors({credentials: true, origin: true}));

    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    const commandBus = new CommandBus();
    const messageRepository = new MessageRepositoryImpl();
    subscribeCommandsToHandlers(commandBus, messageRepository);
    const queryBus = new QueryBus();
    subscribeQueriesToHandlers(queryBus, messageRepository);
    app.use("/", configureMessageRoutes(commandBus, queryBus));

    return app;
};

const subscribeCommandsToHandlers = (commandBus: CommandBus, messageRepository: MessageRepositoryImpl) => {
    commandBus.subscribe(
        LAISSER_MESSAGE,
        new LaisserMessageCommandHandler(messageRepository, new Timer(), new IdGenerator())
    );
    commandBus.subscribe(SUPPRIMER_MESSAGE, new SupprimerMessageCommandHandler(messageRepository));
};

const subscribeQueriesToHandlers = (queryBus: QueryBus, messageRepository: MessageRepositoryImpl) => {
    queryBus.subscribe(RECUPERER_MESSAGES, new RecupererMessagesQueryHandler(messageRepository));
};
