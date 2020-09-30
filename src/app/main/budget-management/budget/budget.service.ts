import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Budget} from '../../../data/models/budget.model';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {BudgetSaveEntity} from '../../../utils/budget-save-entity';

@Injectable({
    providedIn: 'root'
})
export class BudgetService implements Resolve<any> {
    routeParams: any;
    budget: Budget;
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
            if (this.routeParams.id === 'new') {
                this.onBudgetChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.budget = response['response'];
                        this.onBudgetChanged.next(this.budget);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    save(budgetSaveEntity: BudgetSaveEntity): Observable<any> {
        return this._httpClient.post(this.serviceURL, budgetSaveEntity, this.httpOptions);
    }

}
