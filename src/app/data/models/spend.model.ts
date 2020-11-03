import {SPEND_STATE} from '../enums/enums';
import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {BudgetLigne} from './budget.ligne.model';

@Injectable()
export class Spend implements Deserializable {
    id: number;
    label: string;
    amount: number;
    pictures: string;
    date: Date;
    state: SPEND_STATE.AWAITING_APPROVAL;
    budgetLine: BudgetLigne;

    constructor(spend?) {
        spend = spend || {};
        this.id = spend.id;
        this.label = spend.label;
        this.amount = spend.amount;
        this.date = spend.date;
        this.state = spend.state;
        this.pictures = spend.pictures;
        this.budgetLine = spend.budgetLine;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}