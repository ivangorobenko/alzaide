import {IdGenerator} from "../src/domain/communication/repository/IdGenerator";

export class FakeUuidGenerator implements IdGenerator {
    private readonly id: string;
    constructor(id = "myId") {
        this.id = id;
    }
    public generate() {
        return this.id;
    }
}
