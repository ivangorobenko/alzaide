import {v4 as uuidv4} from "uuid";

export class IdGenerator {
    public generate() {
        return uuidv4();
    }
}
