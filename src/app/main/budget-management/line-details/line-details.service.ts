import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {BudgetLine} from '../../../data/models/budget.ligne.model';

@Injectable({
    providedIn: 'root'
})
export class LineDetailsService implements Resolve<any> {
    routeParams: any;
    budgetLine: BudgetLine;
    onBudgetLineChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/budget-lines';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onBudgetLineChanged = new BehaviorSubject({});
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
                this.getBudgetLine()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get budgetLine
     *
     * @returns {Promise<any>}
     */
    getBudgetLine(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                .subscribe((data: any) => {
                    this.budgetLine = data['response'];
                    this.onBudgetLineChanged.next(this.budgetLine);
                    resolve(data['response']);
                }, reject);
        });
    }
}
