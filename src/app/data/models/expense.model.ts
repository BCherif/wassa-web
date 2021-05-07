import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Unity} from './unity.model';
import {Activity} from './activity.model';
import {BudgetLine} from './budget.ligne.model';
import {EXPENSE_STATE} from '../enums/enums';
import {User} from './user.model';

@Injectable()
export class Expense implements Deserializable {
    id: number;
    title: string;
    fileName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    date: Date;
    validateDate: Date;
    unity: Unity;
    validateBy: User;
    activity: Activity;
    budgetLine: BudgetLine;
    state: EXPENSE_STATE;

    constructor(expense?) {
        expense = expense || {};
        this.id = expense.id;
        this.title = expense.title;
        this.fileName = expense.fileName;
        this.state = expense.state;
        this.validateDate = expense.validateDate;
        this.quantity = expense.quantity;
        this.amount = expense.amount;
        this.date = expense.date;
        this.unitPrice = expense.unitPrice;
        this.unity = expense.unity;
        this.activity = expense.activity;
        this.validateBy = expense.validateBy;
        this.budgetLine = expense.budgetLine;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}