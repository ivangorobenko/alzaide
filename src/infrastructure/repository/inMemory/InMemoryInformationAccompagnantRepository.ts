import {InformationAccompagnantRepository} from "../../../domain/communication/repository/InformationAccompagnantRepository";
import {InformationAccompagnantDB} from "../collection/InformationAccompagnantDB";

export class InMemoryInformationAccompagnantRepository implements InformationAccompagnantRepository {
    protected readonly data: InformationAccompagnantDB;

    constructor(telephone = "0123456789") {
        this.data = new InformationAccompagnantDB(telephone);
    }

    recupererNumeroTelephoneAccompagnant(): string {
        return this.data.telephone;
    }
}
