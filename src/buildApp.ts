import {Application} from "express";
import {configureMessageRoutes} from "./infrastructure/http/routes/messageRoutes";
import {CommandBus} from "./core/CommandBus";
import {LAISSER_MESSAGE, LaisserMessageCommandHandler} from "./domain/command/LaisserMessageCommandHandler";
import {Timer} from "./core/Timer";
import {MessageRepositoryImpl} from "./application/repos/MessageRepositoryImpl";
import {QueryBus} from "./core/QueryBus";
import {MessagesQueryHandler, RECUPERER_MESSAGES} from "./domain/query/MessagesQueryHandler";

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

export const buildApp =
    (): Application => {
        const app = express();

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        const commandBus = new CommandBus()
        const messageRepository = new MessageRepositoryImpl();
        commandBus.subscribe(LAISSER_MESSAGE, new LaisserMessageCommandHandler(messageRepository, new Timer()))
        const queryBus = new QueryBus()
        queryBus.subscribe(RECUPERER_MESSAGES, new MessagesQueryHandler(messageRepository))
        app.use('/', configureMessageRoutes(commandBus, queryBus));

        return app;
    }

