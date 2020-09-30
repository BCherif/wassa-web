import {Injectable} from '@angular/core';
import {BudgetLigne} from '../data/models/budget.ligne.model';

@Injectable()
export class SectionBody {
    name: string;
    lines: BudgetLigne[];
}