import {expect} from "chai";
import {InMemoryTacheQuotidienneRepository} from "../../../infrastructure/repository/inMemory/InMemoryTacheQuotidienneRepository";
import {TacheQuotidienne} from "../agregat/TacheQuotidienne";
import {TacheQuotidienneValidee} from "../event/TacheQuotidienneValidee";
import {ValiderTacheQuotidienne, ValiderTacheQuotidienneCommandHandler} from "./ValiderTacheQuotidienneCommandHandler";

describe("Valider tache command quotidienne handler", () => {
    it("doit valider une tache de récéption du journal et renvoyer un événement", () => {
        //GIVEN
        const typeTache = "RECEVOIR_JOURNAL";
        const tacheQuotidienneRepository = new InMemoryTacheQuotidienneRepository();
        const commandHandler = new ValiderTacheQuotidienneCommandHandler(tacheQuotidienneRepository, {now: () => 222});
        tacheQuotidienneRepository.save(typeTache, {
            type: typeTache,
            valide: false,
            timestampMiseAJour: 123,
        });

        //WHEN
        const result = commandHandler.handle(new ValiderTacheQuotidienne(typeTache));

        //THEN
        const tacheValidee: TacheQuotidienne = tacheQuotidienneRepository.get(typeTache);
        expect(tacheValidee.valide).to.be.true;
        expect(tacheValidee.timestampMiseAJour).to.equal(222);
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.deep.equal(new TacheQuotidienneValidee(typeTache));
    });
    it("doit retourner un échec si la tâche qutotidienne n'a pas été trouvée", () => {
        //GIVEN
        const tacheNonExistante = "TACHE_NON_EXISTANTE";
        const tacheValide = "RECEVOIR_JOURNAL";
        const tacheQuotidienneRepository = new InMemoryTacheQuotidienneRepository();
        const commandHandler = new ValiderTacheQuotidienneCommandHandler(tacheQuotidienneRepository, {now: () => 222});
        tacheQuotidienneRepository.save(tacheValide, {
            type: tacheValide,
            valide: false,
            timestampMiseAJour: 123,
        });

        //WHEN
        const result = commandHandler.handle(new ValiderTacheQuotidienne(tacheNonExistante));

        //THEN
        expect(result.isFailure).to.be.true;
        expect(result.getValue()).to.be.deep.equal("TACHE_N_EXISTE_PAS");
    });
});
