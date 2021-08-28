import {Request, Response} from "express";
import {CommandBus} from "../../core/CommandBus";
import {LaisserMessage} from "../../domain/command/LaisserMessageCommandHandler";

export class LaisserMessageController {
    private commandBus: CommandBus;

    constructor(commandBus: CommandBus) {
        this.commandBus = commandBus;
    }

    laisserMessage(req: Request, res: Response) {
        const resultOrError = this.commandBus.dispatch(new LaisserMessage(req.body.message));
        res.sendStatus(resultOrError.isFailure ? 500 : 200);
    }
}