import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {METHOD_OF_PAYMENT} from '../enums/enums';
import {Partner} from './partner.model';
import {BudgetLigne} from './budget.ligne.model';

@Injectable()
export class LinePartner implements Deserializable {
    id: number;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    financeDate: Date = new Date();
    methodOfPayment: METHOD_OF_PAYMENT;
    partner: Partner;
    budgetLine: BudgetLigne;

    constructor(linePartner?) {
        linePartner = linePartner || {};
        this.id = linePartner.id;
        this.amount = linePartner.amount;
        this.balanceBefore = linePartner.balanceBefore;
        this.balanceAfter = linePartner.balanceAfter;
        this.financeDate = linePartner.financeDate;
        this.methodOfPayment = linePartner.methodOfPayment;
        this.partner = linePartner.partner;
        this.budgetLine = linePartner.budgetLine;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}