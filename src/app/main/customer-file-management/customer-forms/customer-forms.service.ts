import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {WassaUtils} from '../../../utils/wassa-utils';
import {CustomerForm} from '../../../data/models/customer.form.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerFormsService implements Resolve<any> {
    customerForms: CustomerForm[];
    onCustomerFormsChanged: BehaviorSubject<any>;
    readonly httpOptions: any;
    readonly serviceURL: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        this.httpOptions = new WassaUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/customer-forms';
        // Set the defaults
        this.onCustomerFormsChanged = new BehaviorSubject({});
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
                this.getCustomerForms()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get customer-forms
     *
     * @returns {Promise<any>}
     */
    getCustomerForms(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['ok'] === true) {
                        this.customerForms = res['data'];
                        this.onCustomerFormsChanged.next(this.customerForms);
                        resolve(res['data']);
                    }
                }, reject);
        });
    }

}
