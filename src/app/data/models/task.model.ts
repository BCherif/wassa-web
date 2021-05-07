import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {TASK_PRIORITY, TASK_STATE} from '../enums/enums';
import {Employee} from './employee.model';
import {Project} from './project.model';

@Injectable()
export class Task implements Deserializable {

    id?: number;
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    state?: TASK_STATE;
    priority?: TASK_PRIORITY;
    createDate?: Date;
    updateDate?: Date;
    enabled?: boolean;
    employee?: Employee;
    project?: Project;

    constructor(task?) {
        task = task || {};
        this.id = task.id || null;
        this.title = task.title;
        this.description = task.description || '';
        this.startDate = new Date(task.startDate);
        this.endDate = new Date(task.endDate);
        this.state = task.state;
        this.priority = task.priority;
        this.createDate = new Date(task.createDate);
        this.updateDate = new Date(task.updateDate);
        this.enabled = task.enabled || true;
        this.employee = task.employee;
        this.project = task.project;
    }


    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}