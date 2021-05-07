import {Injectable} from '@angular/core';
import {Deserializable} from '../data/wrapper/deserializable.wrapper';

@Injectable()
export class LineBody implements Deserializable {
    code?: string;
    title?: string;
    amount?: number;
    executed?: number;
    difference?: number;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: this): boolean {
        return true;
    }

}
