import express, {Request, Response} from "express";
import {MessageController} from "../../../application/controller/MessageController";
import {CommandBus} from "../../../core/CommandBus";
import {QueryBus} from "../../../core/QueryBus";

const messageRouter = express.Router();

export const configureMessageRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const messageController = new MessageController(commandBus, queryBus);
    messageRouter.put("/message", (req: Request, res: Response) => messageController.laisserMessage(req, res));
    messageRouter.get("/messages", (req: Request, res: Response) => messageController.recupererMessages(req, res));
    return messageRouter;
};
