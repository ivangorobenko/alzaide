import express, {Request, Response} from "express";
import {CommunicationController} from "../../../application/controller/CommunicationController";
import {CommandBus} from "../../../core/CommandBus";
import {QueryBus} from "../../../core/QueryBus";

const communicationRouter = express.Router();

export const configureCommunicationRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const communicationController = new CommunicationController(commandBus, queryBus);
    communicationRouter.put("/message", (req: Request, res: Response) =>
        communicationController.laisserMessage(req, res)
    );
    communicationRouter.get("/messages", (req: Request, res: Response) =>
        communicationController.recupererMessages(req, res)
    );
    communicationRouter.delete("/messages/:id", (req: Request, res: Response) => {
        communicationController.supprimerMessage(req, res);
    });
    communicationRouter.put("/alerte", (req: Request, res: Response) =>
        communicationController.alerterAccompagnant(req, res)
    );
    communicationRouter.get("/alerte", (req: Request, res: Response) =>
        communicationController.recupererAlerteLancee(req, res)
    );
    communicationRouter.delete("/alerte", (req: Request, res: Response) =>
        communicationController.arreterAlerteLancee(req, res)
    );
    communicationRouter.post("/tache-quotidienne", (req: Request, res: Response) =>
        communicationController.validerTacheQuotidienne(req, res)
    );
    communicationRouter.get("/tache-quotidienne", (req: Request, res: Response) =>
        communicationController.recupererTachesQuotidiennes(req, res)
    );
    return communicationRouter;
};
