import {Request, Response} from "express";
import {CommandBus} from "../../core/CommandBus";
import {LaisserMessage} from "../../domain/command/LaisserMessageCommandHandler";
import {QueryBus} from "../../core/QueryBus";
import {MessagesQuery} from "../../domain/query/MessagesQueryHandler";

export class MessageController {
    private commandBus: CommandBus;
    private queryBus: QueryBus;

    constructor(commandBus: CommandBus, queryBus: QueryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }

    laisserMessage(req: Request, res: Response) {
        const resultOrError = this.commandBus.dispatch(new LaisserMessage(req.body.message));
        res.sendStatus(resultOrError.isFailure ? 500 : 200);
    }

    recupererMessages(req: Request, res: Response) {
        const resultOrError = this.queryBus.dispatch(new MessagesQuery());
        res.status(resultOrError.isFailure ? 500 : 200).send(resultOrError.getValue());
    }
}