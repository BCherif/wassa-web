import {Injectable} from '@angular/core';
import {Deserializable} from '../wrapper/deserializable.wrapper';

@Injectable()
export class Job implements Deserializable {
    id: number;
    title: string;
    role: string;
    description: string;
    jobDuty: string;

    constructor(job?) {
        job = job || {};
        this.id = job.id;
        this.title = job.title;
        this.role = job.role;
        this.description = job.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}