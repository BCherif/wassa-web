import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Permission} from './permission.model';
import {Injectable} from '@angular/core';

@Injectable()
export class Role implements Deserializable{
    id: number;
    name: string;
    description: string;
    checked: boolean;
    permissions: Permission[];

    constructor(role?) {
        role = role || {};
        this.id = role.id;
        this.name = role.name ;
        this.checked = role.checked || false;
        this.description = role.description;
        this.permissions = role.permissions || [];
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}