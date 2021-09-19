import {Region} from './region.model';
import {Cercle} from './cercle.model';
import {Commune} from './commune.model';
import {Vfq} from './vfq.model';
import {STATE} from '../enums/enums';
import {Category} from './category.model';

export class CustomerForm {
    id?: number;
    state: STATE;
    canal: string;
    category: Category;
    contactId: string;
    lastName: string;
    firstName: string;
    description: string;
    reference: string;
    region: Region;
    cercle: Cercle;
    commune: Commune;
    vfq: Vfq;
}