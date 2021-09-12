import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NatureRequest} from '../../../data/models/nature.request.model';
import {WassaUtils} from '../../../utils/wassa-utils';
import {Category} from '../../../data/models/category.model';

@Injectable({
    providedIn: 'root'
})
export class NatureRequestService implements Resolve<any> {
    natureRequests: NatureRequest[];
    onNatureRequestsChanged: BehaviorSubject<any>;
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
        this.httpOptions = new WassaUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/nature-requests';
        // Set the defaults
        this.onNatureRequestsChanged = new BehaviorSubject({});
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
                this.getNatures()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get natures
     *
     * @returns {Promise<any>}
     */
    getNatures(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    console.log(res);
                    if (res['ok'] === true) {
                        this.natureRequests = res['data'];
                        this.onNatureRequestsChanged.next(this.natureRequests);
                        resolve(res['data']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    create(natureRequest: NatureRequest) {
        return this._httpClient.post(this.serviceURL, natureRequest, this.httpOptions);
    }


    update(uid: any, natureRequest: NatureRequest) {
        return this._httpClient.put(this.serviceURL + '/' + uid, natureRequest, this.httpOptions);
    }
}
