import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {Observable} from 'rxjs';
import {Funding} from '../data/models/funding.model';

@Injectable({
    providedIn: 'root'
})
export class FundingService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/fundings';
        this.httpOptions = new TuwindiUtils().httpHeaders();
    }

    create(funding: Funding): Observable<any> {
        return this.http.post(this.serviceURL + '/create', funding, this.httpOptions);
    }

    getAllByBudgetId(id: number) {
        return this.http.get(this.serviceURL + '/budgetId/' + id, this.httpOptions);
    }

    getAllByLineId(id: number) {
        return this.http.get(this.serviceURL + '/budgetLineId/' + id, this.httpOptions);
    }

}
