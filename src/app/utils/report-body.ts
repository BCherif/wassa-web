import {Injectable} from '@angular/core';
import {Expense} from '../data/models/expense.model';

@Injectable()
export class ReportBody {
    activityName: string;
    expenses: Expense[];
}