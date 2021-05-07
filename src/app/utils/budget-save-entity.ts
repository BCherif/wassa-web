import {Injectable} from '@angular/core';
import {Budget} from '../data/models/budget.model';
import {BudgetLine} from '../data/models/budget.ligne.model';

@Injectable()
export class BudgetSaveEntity {
    budget: Budget;
    lines: BudgetLine[];
}