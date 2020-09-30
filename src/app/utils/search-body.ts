import {Injectable} from '@angular/core';
import {Deserializable} from '../data/wrapper/deserializable.wrapper';
import {TYPE_UNITY} from '../data/enums/enums';

@Injectable()
export class SearchBody implements Deserializable {

    typeUnity: TYPE_UNITY;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: this): boolean {
        return true;
    }

}