import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {BudgetLine} from './budget.ligne.model';
import {Partner} from './partner.model';
import {METHOD_OF_PAYMENT} from '../enums/enums';

@Injectable()
export class Funding implements Deserializable {
    id: number;
    amount: number;
    line: BudgetLine;
    partner: Partner;
    balanceBefore: number;
    balanceAfter: number;
    date: Date;
    methodOfPayment: METHOD_OF_PAYMENT;

    constructor(funding?) {
        funding = funding || {};
        this.id = funding.id;
        this.line = funding.line;
        this.partner = funding.partner;
        this.amount = funding.amount;
        this.balanceBefore = funding.balanceBefore;
        this.balanceAfter = funding.balanceAfter;
        this.date = funding.date;
        this.methodOfPayment = funding.methodOfPayment;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
