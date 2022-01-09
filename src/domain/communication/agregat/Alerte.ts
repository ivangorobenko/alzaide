export class Lieu {
    private latitude: number;
    private longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

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

    private constructor(alerteId: string, lieu: Lieu, timestamp: number) {
        this._alerteId = alerteId;
        this._lieu = lieu;
        this._timestamp = timestamp;
    }

    public static lancer(alerteId: string, lieu: Lieu, timestamp: number) {
        return new Alerte(alerteId, lieu, timestamp);
    }
}
