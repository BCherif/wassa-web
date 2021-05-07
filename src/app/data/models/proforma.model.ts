import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Activity} from './activity.model';

@Injectable()
export class Proforma implements Deserializable {
    id?: number;
    fileName?: string;
    description?: string;
    status: boolean;
    activity: Activity;

    constructor(proforma?) {
        proforma = proforma || {};
        this.id = proforma.id;
        this.fileName = proforma.fileName;
        this.description = proforma.description;
        this.status = proforma.status;
        this.activity = proforma.activity;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}