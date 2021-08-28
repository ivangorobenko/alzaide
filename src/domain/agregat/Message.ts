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

    private constructor(id: string, contenu: string, timestamp: number) {
        this._id = id;
        this._contenu = contenu;
        this._timestamp = timestamp;
    }


    public static create(id: string, contenu: string, timestamp: number): Result<Message> {
        if (contenu === "") return Result.fail("Le contenu de message ne peut pas être vide")
        if (!timestamp) return Result.fail("Le contenu du message ne peut pas être vide")
        if (!id) return Result.fail("L'idenntifiant du message ne peut pas être absent")
        return Result.ok(new Message(id, contenu, timestamp))
    }
}