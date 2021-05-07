import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {PageBody} from '../utils/page-body';

@Injectable({
    providedIn: 'root'
})
export class BudgetLineService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/budget-lines';
        this.httpOptions = new TuwindiUtils().httpHeaders();
    }

    getAllByBudgetId(id: number) {
        return this.http.get(this.serviceURL + '/budgetId/' + id, this.httpOptions);
    }

    getLines(id: number) {
        return this.http.get(this.serviceURL + '/budgetLines/' + id, this.httpOptions);
    }

    getById(id: number) {
        return this.http.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    findAllElementByBudget(page?: PageBody) {
        return this.http.post(this.serviceURL + '/per-page', page, this.httpOptions);
    }

}
