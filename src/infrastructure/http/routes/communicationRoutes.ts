import express, {Request, Response} from "express";
import {CommunicationController} from "../../../application/controller/CommunicationController";
import {CommandBus} from "../../../core/CommandBus";
import {QueryBus} from "../../../core/QueryBus";

const communicationRouter = express.Router();

export const configureMessageRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const messageController = new CommunicationController(commandBus, queryBus);
    communicationRouter.put("/message", (req: Request, res: Response) => messageController.laisserMessage(req, res));
    communicationRouter.get("/messages", (req: Request, res: Response) =>
        messageController.recupererMessages(req, res)
    );
    communicationRouter.delete("/messages/:id", (req: Request, res: Response) => {
        messageController.supprimerMessage(req, res);
    });
    communicationRouter.put("/alerte", (req: Request, res: Response) =>
        messageController.alerterAccompagnant(req, res)
    );
    return communicationRouter;
};
