import {Alerte} from "../../domain/communication/agregat/Alerte";
import {AlerteDB} from "../../infrastructure/repository/dto/AlerteDB";

export class AlerteDataMapper {
    static mapFromDBToDomain(alerteDB: AlerteDB): Alerte {
        return Alerte.create(alerteDB.alerteId, alerteDB.lieu, alerteDB.timestamp, alerteDB.active);
    }

    static mapFromDomainToDB(alerte: Alerte) {
        return new AlerteDB(alerte.alerteId, alerte.lieu, alerte.timestamp, alerte.isActive());
    }
}
