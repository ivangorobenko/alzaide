export class MessageDTO {
    contenu;
    timestamp;
    id;

    constructor(contenu: string, timestamp: number, id: string) {
        this.contenu = contenu;
        this.timestamp = timestamp;
        this.id = id;
    }
}
