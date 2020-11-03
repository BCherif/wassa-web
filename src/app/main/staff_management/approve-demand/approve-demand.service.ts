import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {Demand} from '../../../data/models/demand.model';

@Injectable({
    providedIn: 'root'
})
export class ApproveDemandService implements Resolve<any> {
    routeParams: any;
    demand: Demand;
    onDemandChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/demands';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onDemandChanged = new BehaviorSubject({});
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
                this.getDemand()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get demand
     *
     * @returns {Promise<any>}
     */
    getDemand(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                .subscribe((value: any) => {
                    this.demand = value['response'];
                    this.onDemandChanged.next(this.demand);
                    resolve(value['response']);
                }, reject);
        });
    }

}
