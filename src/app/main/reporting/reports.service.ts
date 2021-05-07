import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {SearchBody} from '../../utils/search-body';
import {environment} from '../../../environments/environment';
import {TuwindiUtils} from '../../utils/tuwindi-utils';

@Injectable({
    providedIn: 'root'
})
export class ReportsService implements Resolve<any> {
    searchBody: SearchBody;
    onReportsChanged: BehaviorSubject<any>;
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
        this.searchBody = new SearchBody();
        this.serviceURL = environment.serviceUrl + '/reports';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onReportsChanged = new BehaviorSubject({});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
                this.getReports(this.searchBody)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get reports
     *
     */
    getReports(searchBody?: SearchBody) {
        return this._httpClient.post(this.serviceURL, searchBody, this.httpOptions);
    }

}
