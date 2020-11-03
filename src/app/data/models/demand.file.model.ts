import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Demand} from './demand.model';

@Injectable()
export class DemandFile implements Deserializable {
    id: number;
    fileName: string;
    description: string;
    status: boolean;
    demand: Demand;

    constructor(demandFile?) {
        demandFile = demandFile || {};
        this.id = demandFile.id;
        this.fileName = demandFile.fileName;
        this.description = demandFile.description;
        this.status = demandFile.status;
        this.demand = demandFile.demand;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}