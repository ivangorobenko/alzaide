import {expect} from "chai";
import {Alerte} from "../../domain/communication/agregat/Alerte";
import {Lieu} from "../../domain/communication/valueObject/Lieu";
import {AlerteDB} from "../../infrastructure/repository/collection/AlerteDB";
import {AlerteDTO} from "../controller/AlerteDTO";
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
        expect(alerte.estLancee()).to.be.equal(alerteDB.lancee);
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
        expect(alerteDB.lancee).to.be.equal(alerte.estLancee());
    });
    it("doit mapper objet Alerte venant du domaine vers l'objet AlerteDTO et direction de UI", () => {
        //GIVEN
        const lieu = new Lieu(1.2, 3.2);
        const alerte: Alerte = Alerte.create("1", lieu, 123, false);
        //WHEN
        const alerteDTO: AlerteDTO = AlerteDataMapper.mapFromDomainToDTO(alerte);
        //THEN
        expect(alerteDTO.alerteId).to.be.equal(alerte.alerteId);
        expect(alerteDTO.lieu).to.deep.equal(lieu);
        expect(alerteDTO.timestamp).to.be.equal(alerte.timestamp);
    });
});
