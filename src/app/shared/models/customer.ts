import { Deserializable } from './deserializable';
import { Injectable } from '@angular/core';

@Injectable()
export class Client implements Deserializable<Client> {

    public id: number;
    public category: any;
    public canal: string;
    public contactId: string;
    public lastName: string;
    public firstName: string;
    public description: string;
    public reference: string;


    deserialize(input: any): Client {
        Object.assign(this, input);
        return this;
    }
}
