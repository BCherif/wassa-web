import {Injectable} from '@angular/core';

@Injectable()
export class PageBody {
    budgetId: number;
    pageNumber: number = 0;
    pageSize: number = 10;
}