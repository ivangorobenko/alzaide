import {Repository} from "../../application/repos/Repository";

export interface ConfigRepository extends Repository<string> {
    get(id: string): string;
}
