import {v4 as uuidv4} from "uuid";

export class UuidGenerator {
    public generate() {
        return uuidv4();
    }
}
