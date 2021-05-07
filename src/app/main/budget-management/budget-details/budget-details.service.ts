import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';

@Injectable({
    providedIn: 'root'
})
export class BudgetDetailsService implements Resolve<any> {
    routeParams: any;
    budget: any;
    onBudgetChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/budgets';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onBudgetChanged = new BehaviorSubject({});
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
                this.getBudget()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get budget
     *
     * @returns {Promise<any>}
     */
    getBudget(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                .subscribe((data: any) => {
                    this.budget = data['response'];
                    this.onBudgetChanged.next(this.budget);
                    resolve(data['response']);
                }, reject);
        });
    }

    getLinesState(id: number) {
        return this._httpClient.get(this.serviceURL + '/lines-state/' + id, this.httpOptions);
    }
}
