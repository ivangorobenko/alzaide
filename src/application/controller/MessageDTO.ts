export class MessageDTO {
    contenu;
    timestamp;

    constructor(contenu: string, timestamp: number) {
        this.contenu = contenu;
        this.timestamp = timestamp;
    }
}
