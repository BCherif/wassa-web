import {Injectable} from '@angular/core';
import {Deserializable} from '../data/wrapper/deserializable.wrapper';

@Injectable()
export class LineUpdateEntity implements Deserializable {
    id?: number;
    title?: string;
    code?: string;
    amount?: number;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: this): boolean {
        return true;
    }

}
