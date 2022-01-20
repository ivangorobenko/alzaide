import {Lieu} from "../valueObject/Lieu";

export class Alerte {
    get id(): string {
        return this._id;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    get lieu(): Lieu {
        return this._lieu;
    }

    private readonly _lieu: Lieu;
    private readonly _timestamp: number;
    private readonly _id: string;
    private _lancee: boolean;

    private constructor(id: string, lieu: Lieu, timestamp: number, lancee = true) {
        this._id = id;
        this._lieu = lieu;
        this._timestamp = timestamp;
        this._lancee = lancee;
    }

    public static lancer(id: string, lieu: Lieu, timestamp: number) {
        return new Alerte(id, lieu, timestamp);
    }

    public static create(id: string, lieu: Lieu, timestamp: number, lancee: boolean) {
        return new Alerte(id, lieu, timestamp, lancee);
    }

    public arreter(): Alerte {
        return new Alerte(this._id, this._lieu, this._timestamp, false);
    }

    public estLancee() {
        return this._lancee;
    }
}
