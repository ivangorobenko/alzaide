import {AlerteDataMapper} from "../../../application/mapper/AlerteDataMapper";
import {Alerte} from "../../../domain/communication/agregat/Alerte";
import {AlerteRepository} from "../../../domain/communication/repository/AlerteRepository";
import {IdGenerator} from "../../../domain/communication/repository/IdGenerator";
import {AlerteDB} from "../collection/AlerteDB";
import {readFile, syncPersistence} from "./file";

export class FileAlerteRepository implements AlerteRepository {
    private readonly filePath: string;
    protected readonly data: {[name: string]: AlerteDB};
    protected idGenerator: IdGenerator;

    constructor(path: string, idGenerator: any) {
        this.idGenerator = idGenerator;
        this.filePath = path;
        this.data = readFile(path) || {};
    }

    async save(value: Alerte): Promise<void> {
        this.data[this.idGenerator.generate()] = AlerteDataMapper.mapFromDomainToDB(value);
        return syncPersistence(this.filePath, this.data);
    }

    getAll(): Alerte[] {
        return Object.values(this.data).map(alerteDB => AlerteDataMapper.mapFromDBToDomain(alerteDB)) as Alerte[];
    }

    recupererAlerteActive(): Alerte | undefined {
        const alerteDBTrouvee = Object.values(this.data).find(alerte =>
            alerte.active ? Alerte.create(alerte.alerteId, alerte.lieu, alerte.timestamp, alerte.active) : undefined
        );
        if (alerteDBTrouvee) return AlerteDataMapper.mapFromDBToDomain(alerteDBTrouvee) as Alerte;
        return undefined;
    }
}
