import {Injectable} from '@angular/core';
import {Deserializable} from '../data/wrapper/deserializable.wrapper';
import {User} from '../data/models/user.model';

@Injectable()
export class AuthBody implements Deserializable {
    userId?: number;
    username?: string;
    password?: string;
    oldPassword?: string;
    newPassword?: string;
    user?: User;
    token?: string;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: this): boolean {
        return true;
    }

}
