import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Category implements Deserializable {
    id: number;
    name: string;
    description: string;
    createDate?: Date = new Date();
    updateDate?: Date;

    constructor(category?) {
        category = category || {};
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.createDate = category.createDate;
        this.updateDate = category.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}