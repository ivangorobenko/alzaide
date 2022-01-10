import {Lieu} from "../../../domain/communication/valueObject/Lieu";

export class AlerteDB {
    public alerteId: string;
    public lieu: Lieu;
    public timestamp: number;
    public active: boolean;

    constructor(alerteId: string, lieu: Lieu, timestamp: number, active: boolean) {
        this.alerteId = alerteId;
        this.lieu = lieu;
        this.timestamp = timestamp;
        this.active = active;
    }
}
