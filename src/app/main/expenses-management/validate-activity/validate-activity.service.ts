import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {Activity} from '../../../data/models/activity.model';

@Injectable({
    providedIn: 'root'
})
export class ValidateActivityService implements Resolve<any> {
    routeParams: any;
    activity: Activity;
    onActivityChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/activities';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onActivityChanged = new BehaviorSubject({});
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
                this.getActivity()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get activity
     *
     * @returns {Promise<any>}
     */
    getActivity(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                .subscribe((response: any) => {
                    this.activity = response['response'];
                    this.onActivityChanged.next(this.activity);
                    resolve(response['response']);
                }, reject);
        });
    }

    validate(activity1: Activity): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/validate', activity1, this.httpOptions);
    }

}
