import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Budget} from './budget.model';
import {LINE_STATE} from '../enums/enums';

@Injectable()
export class BudgetLine implements Deserializable {
    id: number;
    title: string;
    amount: number;
    forecast = false;
    state: LINE_STATE = LINE_STATE.PENDING;
    budget: Budget;
    code: string;
    amountFinanced = 0;
    stayToFinanced = 0;
    numberOfSubLine = 0;
    createDate: Date;
    updateDate: Date;

    constructor(budgetLine?) {
        budgetLine = budgetLine || {};
        this.id = budgetLine.id;
        this.title = budgetLine.title;
        this.state = budgetLine.state;
        this.code = budgetLine.code;
        this.forecast = budgetLine.forecast;
        this.amount = budgetLine.amount;
        this.numberOfSubLine = budgetLine.numberOfSubLine;
        this.amountFinanced = budgetLine.amountFinanced;
        this.stayToFinanced = budgetLine.stayToFinanced;
        this.budget = budgetLine.budget;
        this.createDate = budgetLine.createDate;
        this.updateDate = budgetLine.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
