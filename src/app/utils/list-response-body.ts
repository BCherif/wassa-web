import {Injectable} from '@angular/core';

@Injectable()
export class ListResponseBody<T> {
    content: T[];
    totalElements: number;
}