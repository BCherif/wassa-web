import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Role} from '../../../data/models/role.model';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';

@Injectable({
    providedIn: 'root'
})
export class RolesService implements Resolve<any> {
    roles: Role[];
    onRolesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/roles';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onRolesChanged = new BehaviorSubject({});
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
                this.getRoles()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get roles
     *
     * @returns {Promise<any>}
     */
    getRoles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    this.roles = res['response'];
                    this.onRolesChanged.next(this.roles);
                    resolve(res['response']);
                }, reject);
        });
    }

    save(role: Role): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/save', role, this.httpOptions);
    }

    update(role: Role): Observable<any> {
        return this._httpClient.put(this.serviceURL + '/update', role, this.httpOptions);
    }

    findAll(): Observable<any> {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }


}
