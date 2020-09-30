import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Department} from './department.model';

@Injectable()
export class Employee implements Deserializable {
    id: number;
    lastname: string;
    firstname: string;
    fonction: string;
    email: string;
    telephone: string;
    address: string;
    department: Department;

    constructor(employee?) {
        employee = employee || {};
        this.id = employee.id;
        this.lastname = employee.lastname;
        this.firstname = employee.firstname;
        this.fonction = employee.fonction;
        this.email = employee.email;
        this.telephone = employee.telephone;
        this.address = employee.address;
        this.department = employee.department;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}