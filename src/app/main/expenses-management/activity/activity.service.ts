import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {Activity} from '../../../data/models/activity.model';
import {ActivitySaveEntity} from '../../../utils/activity-save-entity';

@Injectable({
    providedIn: 'root'
})
export class ActivityService implements Resolve<any> {
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
            if (this.routeParams.id === 'new') {
                this.onActivityChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.activity = response['response'];
                        this.onActivityChanged.next(this.activity);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(activitySaveEntity: ActivitySaveEntity): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/save', activitySaveEntity, this.httpOptions);
    }

    update(id: number, activitySaveEntity: ActivitySaveEntity): Observable<any> {
        return this._httpClient.put(this.serviceURL + '/update/' + id, activitySaveEntity, this.httpOptions);
    }

}
