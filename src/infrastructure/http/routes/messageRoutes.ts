import express, {Request, Response} from "express";
import {MessageController} from "../../../application/controller/MessageController";
import {CommandBus} from "../../../core/CommandBus";

const messageRouter = express.Router();

export const configureMessageRoutes = (commandBus: CommandBus) => {
    messageRouter.put('/message',
        (req: Request, res: Response) => new MessageController(commandBus).laisserMessage(req, res)
    )
    messageRouter.get('/messages',
        (req: Request, res: Response) => new MessageController(commandBus).laisserMessage(req, res)
    )
    return messageRouter;
}
