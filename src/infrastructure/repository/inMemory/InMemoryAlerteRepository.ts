import {Alerte} from "../../../domain/communication/agregat/Alerte";
import {AlerteRepository} from "../../../domain/communication/repository/AlerteRepository";
import {InMemoryRepository} from "./InMemoryRepository";

export class InMemoryAlerteRepository extends InMemoryRepository<Alerte> implements AlerteRepository {
    recupererAlerteActive(): Alerte | undefined {
        return Object.values(this.data).find(alerte => alerte.isActive());
    }

    getAll(): Alerte[] {
        return Object.values(this.data);
    }
}
