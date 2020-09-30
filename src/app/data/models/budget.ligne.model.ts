import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Unity} from './unity.model';
import {Budget} from './budget.model';
import {Category} from './category.model';
import {Section} from './section.model';
import {Partner} from './partner.model';
import {LINE_STATE} from '../enums/enums';

@Injectable()
export class BudgetLigne implements Deserializable {
    id: number;
    title: string;
    description: string;
    quantity1: number;
    quantity2: number;
    unitPrice: number;
    total: number;
    solde: number;
    finance: number;
    stayToFinance: number;
    state: LINE_STATE = LINE_STATE.PENDING;
    unity1: Unity;
    unity2: Unity;
    budget: Budget;
    category: Category;
    section: Section;
    partners: Partner[];

    constructor(budgetLigne?) {
        budgetLigne = budgetLigne || {};
        this.id = budgetLigne.id;
        this.title = budgetLigne.title;
        this.description = budgetLigne.description;
        this.quantity1 = budgetLigne.quantity1;
        this.quantity2 = budgetLigne.quantity2;
        this.unitPrice = budgetLigne.unitPrice;
        this.total = budgetLigne.total;
        this.solde = budgetLigne.solde;
        this.finance = budgetLigne.finance;
        this.stayToFinance = budgetLigne.stayToFinance;
        this.state = budgetLigne.state;
        this.unity1 = budgetLigne.unity1;
        this.unity2 = budgetLigne.unity2;
        this.budget = budgetLigne.budget;
        this.category = budgetLigne.category;
        this.section = budgetLigne.section;
        this.partners = budgetLigne.partners;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
