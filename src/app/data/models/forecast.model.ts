import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {BudgetLine} from './budget.ligne.model';

@Injectable()
export class Forecast implements Deserializable{
    id: number;
    amount: number;
    startDate: Date;
    endDate: Date;
    line: BudgetLine;

    constructor(forecast?) {
        forecast = forecast || {};
        this.id = forecast.id;
        this.line = forecast.line;
        this.amount = forecast.amount;
        this.startDate = forecast.startDate;
        this.endDate = forecast.endDate;
    }
    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}