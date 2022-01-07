export class MessageDTO {
    id;
    contenu;
    timestamp;

    constructor(id: string, contenu: string, timestamp: number) {
        this.id = id;
        this.contenu = contenu;
        this.timestamp = timestamp;
    }
}
