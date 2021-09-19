import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {WassaUtils} from '../../../utils/wassa-utils';
import {CustomerForm} from '../../../data/models/customer.form.model';
import {STATE} from '../../../data/enums/enums';

@Injectable({
    providedIn: 'root'
})
export class CustomerFormService implements Resolve<any> {
    routeParams: any;
    customerForm: CustomerForm;
    readonly httpOptions: any;
    readonly serviceURL: string;
    onCustomerFormChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onCustomerFormChanged = new BehaviorSubject({});
        this.httpOptions = new WassaUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/customer-forms';
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getCustomerForm()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get customer
     *
     * @returns {Promise<any>}
     */
    getCustomerForm(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onCustomerFormChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.customerForm = response['data'];
                        this.onCustomerFormChanged.next(this.customerForm);
                        resolve(response['data']);
                    }, reject);
            }
        });
    }

    create(customerForm: CustomerForm) {
        return this._httpClient.post(this.serviceURL, customerForm, this.httpOptions);
    }

    update(state: STATE, customerForm: CustomerForm) {
        return this._httpClient.put(this.serviceURL + '/' + state, customerForm, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }


}
