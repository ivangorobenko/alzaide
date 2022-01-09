import {MessagingService} from "../../domain/communication/service/MessagingService";

export class DummyMessagingService implements MessagingService {
    public telephone: string;
    public message: string;
    private readonly echoue: boolean;

    constructor(echoue: boolean) {
        this.echoue = echoue;
        this.telephone = "";
        this.message = "";
    }

    sendSMS(telephone: string, message: string): boolean {
        if (this.echoue) return false;
        this.telephone = telephone;
        this.message = message;
        return true;
    }
}
