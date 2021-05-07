import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Unity implements Deserializable {
    id: number;
    name: string;
    description: string;

    constructor(unity?) {
        unity = unity || {};
        this.id = unity.id;
        this.name = unity.name;
        this.description = unity.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}