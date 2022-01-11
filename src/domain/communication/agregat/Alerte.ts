import {Lieu} from "../valueObject/Lieu";

export class Alerte {
    get alerteId(): string {
        return this._alerteId;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    get lieu(): Lieu {
        return this._lieu;
    }

    private readonly _lieu: Lieu;
    private readonly _timestamp: number;
    private readonly _alerteId: string;
    private _lancee: boolean;

    private constructor(alerteId: string, lieu: Lieu, timestamp: number, lancee = true) {
        this._alerteId = alerteId;
        this._lieu = lieu;
        this._timestamp = timestamp;
        this._lancee = lancee;
    }

    public static lancer(alerteId: string, lieu: Lieu, timestamp: number) {
        return new Alerte(alerteId, lieu, timestamp);
    }

    public static create(alerteId: string, lieu: Lieu, timestamp: number, lancee: boolean) {
        return new Alerte(alerteId, lieu, timestamp, lancee);
    }

    public arreter(): Alerte {
        return new Alerte(this._alerteId, this._lieu, this._timestamp, false);
    }

    public estLancee() {
        return this._lancee;
    }
}
