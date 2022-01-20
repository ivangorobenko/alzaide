import {Lieu} from "../../../domain/communication/valueObject/Lieu";

export class AlerteDB {
    public id: string;
    public lieu: Lieu;
    public timestamp: number;
    public lancee: boolean;

    constructor(id: string, lieu: Lieu, timestamp: number, lancee: boolean) {
        this.id = id;
        this.lieu = lieu;
        this.timestamp = timestamp;
        this.lancee = lancee;
    }
}
