import {v4 as uuidv4} from "uuid";
import {IdGenerator} from "../../domain/communication/repository/IdGenerator";

export class UuidGenerator implements IdGenerator {
    public generate() {
        return uuidv4();
    }
}
