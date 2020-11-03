import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {PageBody} from '../../../utils/page-body';
import {Budget} from '../../../data/models/budget.model';

@Injectable({
    providedIn: 'root'
})
export class BudgetsService implements Resolve<any> {
    pageBody: PageBody;
    budgets: Budget[];
    onBudgetsChanged: BehaviorSubject<any>;
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
        this.pageBody = new PageBody();
        this.serviceURL = environment.serviceUrl + '/budgets';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onBudgetsChanged = new BehaviorSubject({});
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
                this.getBudgets(this.pageBody)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get budgets
     *
     */
    getBudgets(page?: PageBody) {
        return this._httpClient.post(this.serviceURL + '/all', page, this.httpOptions);
    }

    save(budget: Budget): Observable<any> {
        return this._httpClient.post(this.serviceURL, budget, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    update(budget: Budget): Observable<any> {
        return this._httpClient.put(this.serviceURL, budget, this.httpOptions);
    }

    findAll(): Observable<any> {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }


}
