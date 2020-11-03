import {DEMAND_STATE} from '../enums/enums';
import {User} from './user.model';
import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Budget} from './budget.model';
import {DemandFile} from './demand.file.model';

@Injectable()
export class Demand implements Deserializable {
    id: number;
    title: string;
    demandDate: Date;
    demandState: DEMAND_STATE.APPROVED;
    description: string;
    createBy: User;
    budget: Budget;
    files: DemandFile[];

    constructor(demand?) {
        demand = demand || {};
        this.id = demand.id;
        this.title = demand.title;
        this.budget = demand.budget;
        this.demandState = demand.demandState;
        this.demandDate = demand.demandDate;
        this.description = demand.description;
        this.createBy = demand.createBy;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}