import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';

@Injectable()
export class Permission implements Deserializable {
    id: number;
    name: string;
    authority?: string;
    description: string;
    checked: boolean;

    constructor(permission?) {
        permission = permission || {};
        this.id = permission.id;
        this.name = permission.name;
        this.authority = permission.authority;
        this.checked = permission.checked || false;
        this.description = permission.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}