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

    get active(): boolean {
        return this._active;
    }

    private readonly _lieu: Lieu;
    private readonly _timestamp: number;
    private readonly _alerteId: string;
    private _active: boolean;

    private constructor(alerteId: string, lieu: Lieu, timestamp: number) {
        this._alerteId = alerteId;
        this._lieu = lieu;
        this._timestamp = timestamp;
        this._active = true;
    }

    public static lancer(alerteId: string, lieu: Lieu, timestamp: number) {
        return new Alerte(alerteId, lieu, timestamp);
    }

    public desactiver() {
        this._active = false;
    }
}
