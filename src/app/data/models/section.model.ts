import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Section implements Deserializable {
    id: number;
    title: string;

    constructor(section?) {
        section = section || {};
        this.id = section.id;
        this.title = section.title;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}