import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Project implements Deserializable {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createDate?: Date = new Date();
    updateDate?: Date;

    constructor(project?) {
        project = project || {};
        this.id = project.id;
        this.title = project.title;
        this.description = project.description;
        this.startDate = project.startDate;
        this.endDate = project.endDate;
        this.createDate = project.createDate;
        this.updateDate = project.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}