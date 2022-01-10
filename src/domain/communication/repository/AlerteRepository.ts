import {Repository} from "../../../core/Repository";
import {Alerte} from "../agregat/Alerte";

export interface AlerteRepository extends Repository<Alerte> {
    recupererAlerteActive(): Alerte | undefined;
}
