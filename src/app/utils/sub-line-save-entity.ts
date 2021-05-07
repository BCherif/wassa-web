import {Injectable} from '@angular/core';
import {BudgetLine} from '../data/models/budget.ligne.model';
import {SubLine} from '../data/models/sub.line.model';

@Injectable()
export class SubLineSaveEntity {
    budgetLine: BudgetLine;
    subLines: SubLine[];
}