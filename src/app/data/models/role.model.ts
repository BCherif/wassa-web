import {Permission} from './permission.model';

export class Role {
    id: number;
    name: string;
    authority: string;
    description: string;
    checked: boolean;
    permissions: Permission[];

}