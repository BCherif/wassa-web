import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {PageBody} from '../../../utils/page-body';
import {Demand} from '../../../data/models/demand.model';

@Injectable({
    providedIn: 'root'
})
export class DemandsService implements Resolve<any> {
    pageBody: PageBody;
    onDemandsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/demands';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onDemandsChanged = new BehaviorSubject({});
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
                this.getDemands(this.pageBody)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get demands
     *
     */
    getDemands(page?: PageBody) {
        return this._httpClient.post(this.serviceURL + '/all', page, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    findAll(): Observable<any> {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }

    approve(demand: Demand): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/approve', demand, this.httpOptions);
    }

    validate(demand: Demand): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/validate', demand, this.httpOptions);
    }
}
