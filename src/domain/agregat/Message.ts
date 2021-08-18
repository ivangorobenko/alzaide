import {v4 as uuidv4} from "uuid";
import {Result} from "../../core/Result";

export class Message {
    get timestamp(): number {
        return this._timestamp;
    }
    get id(): string {
        return this._id;
    }
    get contenu(): string {
        return this._contenu;
    }
    private readonly _contenu: string;
    private readonly _id: string;
    private readonly _timestamp: number;

    private constructor(contenu: string, timestamp: number) {
        this._contenu = contenu;
        this._timestamp = timestamp;
        this._id = uuidv4();
    }



    public static create(contenu: string, timestamp: number): Result<Message> {
        if (contenu === "") return Result.fail("Le contenu de message ne peut pas être vide")
        if (!timestamp) return Result.fail("Le contenu de message ne peut pas être vide")
        return Result.ok(new Message(contenu, timestamp))
    }
}