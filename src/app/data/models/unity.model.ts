import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {TYPE_UNITY} from '../enums/enums';

@Injectable()
export class Unity implements Deserializable {
    id: number;
    title: string;
    typeUnity: TYPE_UNITY;

    constructor(unity?) {
        unity = unity || {};
        this.id = unity.id;
        this.title = unity.title;
        this.typeUnity = unity.typeUnity;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}