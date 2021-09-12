import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NatureRequest} from '../../../data/models/nature.request.model';
import {WassaUtils} from '../../../utils/wassa-utils';
import {RequestType} from '../../../data/models/request.type.model';

@Injectable({
    providedIn: 'root'
})
export class RequestTypesService implements Resolve<any> {
    requestTypes: RequestType[];
    onRequestTypesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/request-types';
        // Set the defaults
        this.onRequestTypesChanged = new BehaviorSubject({});
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
                this.getTypes()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get types
     *
     * @returns {Promise<any>}
     */
    getTypes(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['ok'] === true) {
                        this.requestTypes = res['data'];
                        this.onRequestTypesChanged.next(this.requestTypes);
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

    create(requestType: RequestType) {
        return this._httpClient.post(this.serviceURL, requestType, this.httpOptions);
    }

    update(uid: any, requestType: RequestType) {
        return this._httpClient.put(this.serviceURL + '/' + uid, requestType, this.httpOptions);
    }
}
