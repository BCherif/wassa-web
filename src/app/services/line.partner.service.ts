import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {LinePartner} from '../data/models/line.partner';
import {PageBody} from '../utils/page-body';

@Injectable({
    providedIn: 'root'
})
export class LinePartnerService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/line-partners';
        this.httpOptions = new TuwindiUtils().httpHeaders();
    }

    save(linePartner: LinePartner) {
        return this.http.post(this.serviceURL + '/create', linePartner, this.httpOptions);
    }

    findAllElementByBudget(page?: PageBody) {
        return this.http.post(this.serviceURL + '/by-budget', page, this.httpOptions);
    }

}
