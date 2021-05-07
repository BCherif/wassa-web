import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    readonly serviceURL: string;
    readonly httpOptions: any;
    readonly uploadOption: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/expenses';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        this.uploadOption = new TuwindiUtils().uploadOption();
    }

    sumExpenseByLine(id: number) {
        return this.http.get(this.serviceURL + '/sum-by-line/' + id, this.httpOptions);
    }

    getAllByActivityId(id: number) {
        return this.http.get(this.serviceURL + '/by-activityId/' + id, this.httpOptions);
    }

    findAllByLineId(id: number) {
        return this.http.get(this.serviceURL + '/lineId/' + id, this.httpOptions);
    }

    getAllBylineId(id: number) {
        return this.http.get(this.serviceURL + '/budgetLineId/' + id, this.httpOptions);
    }

    /**
     * UPLOAD FILE
     */
    upload(id: number, obj: FormData) {
        return this.http.post(this.serviceURL + '/validate?id=' + id, obj, this.uploadOption);
    }

}
