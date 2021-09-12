import {Entity} from '../../utils/entity';
import {Role} from './role.model';

export class User extends Entity {
    lastName?: string;
    firstName?: string;
    fullName?: string;
    username?: string;
    password?: string;
    phone?: string;
    address?: string;
    turnoverTarget?: number;
    loggedIn?: boolean;
    email?: string;
    enabled?: boolean;
    function?: string;
    token?: string;
    imageUri?: string;
    checked: boolean;
    roles: Role[];
}