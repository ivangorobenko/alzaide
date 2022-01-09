import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {CommandBus} from "../../core/CommandBus";
import {AlerterAccompagnant} from "../../domain/communication/command/AlerterAccompagnantHandler";
import {Lieu} from "../../domain/communication/valueObject/Lieu";

export class AlerteController {
    private commandBus: CommandBus;

    constructor(commandBus: CommandBus) {
        this.commandBus = commandBus;
    }

    alerterAccompagnant(req: Request, res: Response) {
        const alerte = req.body.alerte;
        const resultOrError = this.commandBus.dispatch(
            new AlerterAccompagnant(new Lieu(alerte.lieu.latitude, alerte.lieu.longitude), alerte.timestamp)
        );
        res.sendStatus(resultOrError.isFailure ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.NO_CONTENT);
    }
}
