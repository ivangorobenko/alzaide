import {expect} from "chai";
import {Alerte} from "../../domain/communication/agregat/Alerte";
import {Lieu} from "../../domain/communication/valueObject/Lieu";
import {AlerteDB} from "../../infrastructure/repository/dto/AlerteDB";
import {AlerteDataMapper} from "./AlerteDataMapper";

describe("AlerteDataMapper", () => {
    it("doit mapper objet AlerteDB venant de persistance vers une entité du domaine Alerte ", () => {
        //GIVEN
        const lieu = new Lieu(1.2, 3.2);
        const alerteDB: AlerteDB = new AlerteDB("1", lieu, 123, true);
        //WHEN
        const alerte: Alerte = AlerteDataMapper.mapFromDBToDomain(alerteDB);
        //THEN
        expect(alerte.alerteId).to.be.equal(alerteDB.alerteId);
        expect(alerte.lieu).to.deep.equal(lieu);
        expect(alerte.timestamp).to.be.equal(alerteDB.timestamp);
        expect(alerte.isActive()).to.be.equal(alerteDB.active);
    });

    it("doit mapper objet Alerte venant du domaine vers l'objet de la persistance ", () => {
        //GIVEN
        const lieu = new Lieu(1.2, 3.2);
        const alerte: Alerte = Alerte.create("1", lieu, 123, false);
        //WHEN
        const alerteDB: AlerteDB = AlerteDataMapper.mapFromDomainToDB(alerte);
        //THEN
        expect(alerteDB.alerteId).to.be.equal(alerte.alerteId);
        expect(alerteDB.lieu).to.deep.equal(lieu);
        expect(alerteDB.timestamp).to.be.equal(alerte.timestamp);
        expect(alerteDB.active).to.be.equal(alerte.isActive());
    });
});
