import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Department implements Deserializable {
    id: number;
    name: string;
    description: string;

    constructor(department?) {
        department = department || {};
        this.id = department.id;
        this.name = department.name;
        this.description = department.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}