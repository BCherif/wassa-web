import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Project} from './project.model';
import {BUDGET_STATE} from '../enums/enums';

@Injectable()
export class Budget implements Deserializable {
    id: number;
    title: string;
    amount: number;
    state: BUDGET_STATE;
    project: Project;
    startDate: Date;
    endDate: Date;
    createDate: Date;
    updateDate: Date;

    constructor(budget?) {
        budget = budget || {};
        this.id = budget.id;
        this.title = budget.title;
        this.amount = budget.amount;
        this.state = budget.state;
        this.project = budget.project;
        this.startDate = budget.startDate;
        this.endDate = budget.endDate;
        this.createDate = budget.createDate;
        this.updateDate = budget.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}