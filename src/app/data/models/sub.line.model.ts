import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {BudgetLine} from './budget.ligne.model';
import {Category} from './category.model';

@Injectable()
export class SubLine implements Deserializable {
    id: number;
    title: string;
    amount: number;
    line: BudgetLine;
    category: Category;

    constructor(subLine?) {
        subLine = subLine || {};
        this.id = subLine.id;
        this.title = subLine.title;
        this.amount = subLine.amount;
        this.line = subLine.line;
        this.category = subLine.category;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}