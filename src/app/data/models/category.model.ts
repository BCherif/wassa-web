import {NatureRequest} from './nature.request.model';
import {Entity} from '../../utils/entity';

export class Category {
    id?: number;
    category: string;
    state: boolean;
    natureRequest: NatureRequest;
}