import {Entity} from '../../utils/entity';

export class Permission {
    name: string;
    authority?: string;
    description: string;
    checked: boolean;
}