import {NatureRequest} from './nature.request.model';

export class Category {
    id?: number;
    category: string;
    state: boolean;
    natureRequest: NatureRequest;
}