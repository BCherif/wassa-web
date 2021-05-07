import {Injectable} from '@angular/core';
import {Activity} from '../data/models/activity.model';
import {Expense} from '../data/models/expense.model';

@Injectable()
export class ActivitySaveEntity {
    activity: Activity;
    expenses: Expense[];
}