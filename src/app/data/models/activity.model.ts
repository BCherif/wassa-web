import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {ACTIVITY_STATE} from '../enums/enums';
import {User} from './user.model';
import {Budget} from './budget.model';

@Injectable()
export class Activity implements Deserializable {
    id?: number;
    title?: string;
    createDate?: Date = new Date();
    updateDate?: Date;
    startDate?: Date;
    endDate?: Date;
    createBy?: User;
    budget?: Budget;
    state?: ACTIVITY_STATE;
    isGroupBy = true;
    pay = true;

    constructor(activity?) {
        activity = activity || {};
        this.id = activity.id;
        this.title = activity.title;
        this.state = activity.state;
        this.startDate = activity.startDate;
        this.endDate = activity.endDate;
        this.createDate = activity.createDate;
        this.updateDate = activity.updateDate;
        this.createBy = activity.createBy;
        this.budget = activity.budget;
        this.isGroupBy = activity.isGroupBy;
        this.pay = activity.pay;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}