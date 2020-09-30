import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Partner implements Deserializable {
    id: number;
    name: string;
    contact: string;
    country: string;

    constructor(partner?) {
        partner = partner || {};
        this.id = partner.id;
        this.name = partner.name;
        this.contact = partner.contact;
        this.country = partner.country;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}