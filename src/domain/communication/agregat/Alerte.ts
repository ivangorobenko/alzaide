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
    private _active: boolean;

    private constructor(alerteId: string, lieu: Lieu, timestamp: number, active = true) {
        this._alerteId = alerteId;
        this._lieu = lieu;
        this._timestamp = timestamp;
        this._active = active;
    }

    public static lancer(alerteId: string, lieu: Lieu, timestamp: number) {
        return new Alerte(alerteId, lieu, timestamp);
    }

    public static create(alerteId: string, lieu: Lieu, timestamp: number, active: boolean) {
        return new Alerte(alerteId, lieu, timestamp, active);
    }

    public desactiver(): Alerte {
        return new Alerte(this._alerteId, this._lieu, this._timestamp, false);
    }

    isActive() {
        return this._active;
    }
}
