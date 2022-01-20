import {expect} from "chai";
import {InMemoryAlerteRepository} from "../../../infrastructure/repository/inMemory/InMemoryAlerteRepository";
import {UuidGenerator} from "../../../infrastructure/repository/UuidGenerator";
import {Alerte} from "../agregat/Alerte";
import {AlerteLanceeArretee} from "../event/AlerteLanceeArretee";
import {Lieu} from "../valueObject/Lieu";
import {ArreterAlerteLancee, ArreterAlerteLanceeCommandHandler} from "./ArreterAlerteLanceeCommandHandler";

describe("ArreterAlerteLanceeCommandHandler", function () {
    it("doit arreter alerte lancee", function () {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(new UuidGenerator());
        const sut = new ArreterAlerteLanceeCommandHandler(alerteRepository);
        alerteRepository.save(Alerte.lancer("alerteId", new Lieu(1, 2), 123));

        //WHEN
        const result = sut.handle(new ArreterAlerteLancee());

        //THEN
        expect(result.isSuccess).to.be.true;
        expect(alerteRepository.recupererAlerteLancee()).to.be.undefined;
    });
    it("doit renvoyer un erreur si aucune alerte lancee", () => {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(new UuidGenerator());
        const sut = new ArreterAlerteLanceeCommandHandler(alerteRepository);
        alerteRepository.save(Alerte.create("alerteId", new Lieu(1, 2), 123, false));

        //WHEN
        const result = sut.handle(new ArreterAlerteLancee());

        //THEN
        expect(result.isFailure).to.be.true;
        expect(result.getValue()).to.equal("Aucune alerte lancee");
    });
    it("doit renvoyer un événement si alerte est bien arrêtée", function () {
        //GIVEN
        const alerteRepository = new InMemoryAlerteRepository(new UuidGenerator());
        const sut = new ArreterAlerteLanceeCommandHandler(alerteRepository);
        alerteRepository.save(Alerte.lancer("alerteId", new Lieu(1, 2), 123));

        //WHEN
        const result = sut.handle(new ArreterAlerteLancee());

        //THEN
        expect(result.getValue()).to.deep.equal(new AlerteLanceeArretee("alerteId"));
    });
});
