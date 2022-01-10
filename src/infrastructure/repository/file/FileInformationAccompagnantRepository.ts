import {InformationAccompagnantRepository} from "../../../domain/communication/repository/InformationAccompagnantRepository";
import {InformationAccompagnantDB} from "../collection/InformationAccompagnantDB";
import {readFile} from "./file";

export class FileInformationAccompagnantRepository implements InformationAccompagnantRepository {
    protected readonly data: InformationAccompagnantDB;

    constructor(path: string) {
        this.data = readFile(path) || {};
    }

    recupererNumeroTelephoneAccompagnant(): string {
        return this.data.telephone;
    }
}
