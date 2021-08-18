import express, {Request, Response} from "express";
import {LaisserMessageController} from "../../../application/use_cases/LaisserMessageController";

const memberRouter = express.Router();

export const configureMessageRoutes = (commandBus)=>{
    memberRouter.post('/message',
        (req: Request, res: Response) => new LaisserMessageController(commandBus).laisserMessage(req, res)
    )
}
