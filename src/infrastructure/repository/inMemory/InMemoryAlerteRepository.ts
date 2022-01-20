import {Alerte} from "../../../domain/communication/agregat/Alerte";
import {AlerteRepository} from "../../../domain/communication/repository/AlerteRepository";
import {InMemoryRepository} from "./InMemoryRepository";

export class InMemoryAlerteRepository extends InMemoryRepository<Alerte> implements AlerteRepository {
    //FIXME implementer mappeur dans inmemory
    recupererAlerteLancee(): Alerte | undefined {
        return Object.values(this.data).find(alerte => alerte.estLancee());
    }

    save(value: Alerte): void {
        const alerteExistante = Object.entries(this.data).find(([, item]) => item.id === value.id);
        if (alerteExistante === undefined) {
            this.data[this.idGenerator.generate()] = value;
        } else {
            this.data[alerteExistante[0]] = value;
        }
    }

    getAll(): Alerte[] {
        return Object.values(this.data);
    }
}
