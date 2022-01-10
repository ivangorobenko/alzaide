import {expect} from "chai";
import {Lieu} from "../valueObject/Lieu";
import {Alerte} from "./Alerte";

describe("Alerte", () => {
    it("doit pouvoir être lancée avec l'id, lieu et l'heure", function () {
        //GIVEN
        const alerteId = "uniqueAlerteId";
        const lieu = new Lieu(43.604663, 1.44511);
        const timestamp = 123;

        //WHEN
        const alerte: Alerte = Alerte.lancer(alerteId, lieu, timestamp);

        //THEN
        expect(alerte.alerteId).to.deep.equal(alerteId);
        expect(alerte.lieu).to.deep.equal(lieu);
        expect(alerte.timestamp).to.deep.equal(timestamp);
    });
    it("doit permettre de savoir si une alerte est active", function () {
        //GIVEN
        const alerte: Alerte = Alerte.lancer("uniqueAlerteId", new Lieu(43.604663, 1.44511), 123);

        //WHEN
        alerte.desactiver();

        //THEN
        expect(alerte.isActive()).to.be.false;
    });
    it("doit être active à son lancement", function () {
        //GIVEN
        const alerteId = "uniqueAlerteId";
        const lieu = new Lieu(43.604663, 1.44511);
        const timestamp = 123;

        //WHEN
        const alerte: Alerte = Alerte.lancer(alerteId, lieu, timestamp);

        //THEN
        expect(alerte.isActive()).to.be.true;
    });
    it("doit pouvoir être passée en non-active", function () {
        //GIVEN
        const alerte: Alerte = Alerte.lancer("uniqueAlerteId", new Lieu(43.604663, 1.44511), 123);

        //WHEN
        alerte.desactiver();

        //THEN
        expect(alerte.isActive()).to.be.false;
    });
});
