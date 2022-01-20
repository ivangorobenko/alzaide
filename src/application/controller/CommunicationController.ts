import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {CommandBus} from "../../core/CommandBus";
import {QueryBus} from "../../core/QueryBus";
import {Message} from "../../domain/communication/agregat/Message";
import {AlerterAccompagnant} from "../../domain/communication/command/AlerterAccompagnantCommandHandler";
import {ArreterAlerteLancee} from "../../domain/communication/command/ArreterAlerteLanceeCommandHandler";
import {LaisserMessage} from "../../domain/communication/command/LaisserMessageCommandHandler";
import {SupprimerMessage} from "../../domain/communication/command/SupprimerMessageCommandHandler";
import {RecupererAlerteLancee} from "../../domain/communication/query/RecupererAlerteLanceeQueryHandler";
import {RecupererMessagesQuery} from "../../domain/communication/query/RecupererMessagesQueryHandler";
import {Lieu} from "../../domain/communication/valueObject/Lieu";
import {AlerteDataMapper} from "../mapper/AlerteDataMapper";
import {MessageDataMapper} from "../mapper/MessageDataMapper";

export class CommunicationController {
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

    alerterAccompagnant(req: Request, res: Response) {
        const alerte = req.body.alerte;
        const resultOrError = this.commandBus.dispatch(
            new AlerterAccompagnant(new Lieu(alerte.lieu.latitude, alerte.lieu.longitude), alerte.timestamp)
        );
        res.sendStatus(resultOrError.isFailure ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.NO_CONTENT);
    }

    recupererAlerteLancee(req: Request, res: Response) {
        const resultOrError = this.queryBus.dispatch(new RecupererAlerteLancee());
        res.status(StatusCodes.OK).send(AlerteDataMapper.mapFromDomainToDTO(resultOrError.getValue()));
    }

    arreterAlerteLancee(req: Request, res: Response) {
        const result = this.commandBus.dispatch(new ArreterAlerteLancee());
        if (result.isFailure) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
}
