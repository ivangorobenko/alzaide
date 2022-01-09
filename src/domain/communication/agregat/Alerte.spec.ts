import {expect} from "chai";
import {Alerte, Lieu} from "./Alerte";

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
});
