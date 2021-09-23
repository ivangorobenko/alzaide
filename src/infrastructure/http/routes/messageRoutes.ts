import express, {Request, Response} from "express";
import {MessageController} from "../../../application/controller/MessageController";
import {CommandBus} from "../../../core/CommandBus";
import {QueryBus} from "../../../core/QueryBus";

const messageRouter = express.Router();

export const configureMessageRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    messageRouter.put("/message", (req: Request, res: Response) => {
        console.log("ici");
        new MessageController(commandBus, queryBus).laisserMessage(req, res);
    });
    messageRouter.get("/messages", (req: Request, res: Response) =>
        new MessageController(commandBus, queryBus).recupererMessages(req, res)
    );
    return messageRouter;
};
