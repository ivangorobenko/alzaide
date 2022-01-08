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

    sendSMS(telephone: string, message: string): string | undefined {
        if (this.echoue) return undefined;
        this.telephone = telephone;
        this.message = message;
        return "12223344";
    }
}
