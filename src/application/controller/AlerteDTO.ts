import {Lieu} from "../../domain/communication/valueObject/Lieu";

export class AlerteDTO {
    alerteId;
    lieu;
    timestamp;

    constructor(alerteId: string, lieu: Lieu, timestamp: number) {
        this.alerteId = alerteId;
        this.lieu = lieu;
        this.timestamp = timestamp;
    }
}
