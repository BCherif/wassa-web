import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Role} from './role.model';
import {Employee} from './employee.model';

@Injectable()
export class User implements Deserializable {
    id?: number;
    username?: string;
    password?: string;
    loggedIn?: boolean;
    enabled?: boolean;
    checked: boolean;
    token?: string;
    roles?: Role[];
    employee?: Employee;


    constructor(user?) {
        user = user || {};
        this.id = user?.id;
        this.username = user?.username;
        this.enabled = user?.enabled;
        this.password = user?.password;
        this.roles = user?.roles || [];
        this.loggedIn = user?.loggedIn;
        this.employee = user?.employee;
        this.token = user?.token;
        this.checked = user?.checked;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }

}