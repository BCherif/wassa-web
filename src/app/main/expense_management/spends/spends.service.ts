import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {PageBody} from '../../../utils/page-body';
import {Spend} from '../../../data/models/spend.model';

@Injectable({
    providedIn: 'root'
})
export class SpendsService implements Resolve<any> {
    pageBody: PageBody;
    onSpendsChanged: BehaviorSubject<any>;
    readonly httpOptions: any;
    readonly uploadOption: any;
    readonly serviceURL: string;
    imageURL = environment.serviceUrl + '/spends/images';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        this.pageBody = new PageBody();
        this.serviceURL = environment.serviceUrl + '/spends';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        this.uploadOption = new TuwindiUtils().uploadOption();
        // Set the defaults
        this.onSpendsChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getSpends(this.pageBody)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get spends
     *
     */
    getSpends(page?: PageBody) {
        return this._httpClient.post(this.serviceURL + '/all', page, this.httpOptions);
    }

    disbursement(spend: Spend): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/disbursement', spend, this.httpOptions);
    }

    validate(spend: Spend): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/validate', spend, this.httpOptions);
    }

    /**
     * UPLOAD FILE
     */
    upload(id: number, obj: FormData) {
        return this._httpClient.post(this.serviceURL + '/upload?id=' + id, obj, this.uploadOption);
    }
}
