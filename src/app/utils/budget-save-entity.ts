import {Injectable} from '@angular/core';
import {Budget} from '../data/models/budget.model';
import {SectionBody} from './section-body';

@Injectable()
export class BudgetSaveEntity {
    budget: Budget;
    sections: SectionBody[];
}