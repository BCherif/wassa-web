import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Project} from './project.model';

@Injectable()
export class Budget implements Deserializable {
    id: number;
    title: string;
    amount: number;
    project: Project;

    constructor(budget?) {
        budget = budget || {};
        this.id = budget.id;
        this.title = budget.title;
        this.amount = budget.amount;
        this.project = budget.project;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}