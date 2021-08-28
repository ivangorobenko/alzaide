import express, {Request, Response} from "express";
import {LaisserMessageController} from "../../../application/controller/LaisserMessageController";
import {CommandBus} from "../../../core/CommandBus";

const memberRouter = express.Router();

export const configureMessageRoutes = (commandBus: CommandBus) => {
    memberRouter.put('/message',
        (req: Request, res: Response) => new LaisserMessageController(commandBus).laisserMessage(req, res)
    )
    return memberRouter;
}
