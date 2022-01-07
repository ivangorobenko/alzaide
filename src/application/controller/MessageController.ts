import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {CommandBus} from "../../core/CommandBus";
import {QueryBus} from "../../core/QueryBus";
import {Message} from "../../domain/agregat/Message";
import {LaisserMessage} from "../../domain/command/LaisserMessageCommandHandler";
import {SupprimerMessage} from "../../domain/command/SupprimerMessageCommandHandler";
import {RecupererMessagesQuery} from "../../domain/query/RecupererMessagesQueryHandler";
import {MessageDataMapper} from "../mapper/MessageDataMapper";

export class MessageController {
    private commandBus: CommandBus;
    private queryBus: QueryBus;

    constructor(commandBus: CommandBus, queryBus: QueryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }

    laisserMessage(req: Request, res: Response) {
        const resultOrError = this.commandBus.dispatch(new LaisserMessage(req.body.message));
        res.sendStatus(resultOrError.isFailure ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.NO_CONTENT);
    }

    recupererMessages(req: Request, res: Response) {
        const doSend = (resultValue: Message[]) =>
            resultValue.map((message: Message) => MessageDataMapper.mapFromDomainToDTO(message));
        const resultOrError = this.queryBus.dispatch(new RecupererMessagesQuery());
        if (resultOrError.isFailure) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        res.status(StatusCodes.OK).send(doSend(resultOrError.getValue()));
    }

    supprimerMessage(req: Request, res: Response) {
        const resultOrError = this.commandBus.dispatch(new SupprimerMessage(req.params.id));
        if (resultOrError.isFailure) return res.sendStatus(StatusCodes.BAD_REQUEST);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
}
