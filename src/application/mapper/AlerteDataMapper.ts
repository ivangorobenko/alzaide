import {Alerte} from "../../domain/communication/agregat/Alerte";
import {AlerteDB} from "../../infrastructure/repository/collection/AlerteDB";
import {AlerteDTO} from "../controller/AlerteDTO";

export class AlerteDataMapper {
    static mapFromDBToDomain(alerteDB: AlerteDB): Alerte {
        return Alerte.create(alerteDB.id, alerteDB.lieu, alerteDB.timestamp, alerteDB.lancee);
    }

    static mapFromDomainToDB(alerte: Alerte): AlerteDB {
        return new AlerteDB(alerte.id, alerte.lieu, alerte.timestamp, alerte.estLancee());
    }

    static mapFromDomainToDTO(alerte: Alerte): AlerteDTO {
        return new AlerteDTO(alerte.id, alerte.lieu, alerte.timestamp);
    }
}
