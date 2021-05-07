import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Role} from '../../../data/models/role.model';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';

@Injectable({
    providedIn: 'root'
})
export class RoleService implements Resolve<any> {
    routeParams: any;
    role: Role;
    readonly httpOptions: any;
    readonly serviceURL: string;
    onRoleChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onRoleChanged = new BehaviorSubject({});
        this.httpOptions = new TuwindiUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/roles';
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
                this.getRole()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get role
     *
     * @returns {Promise<any>}
     */
    getRole(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.name === 'new') {
                this.onRoleChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/by-name/' + this.routeParams.name, this.httpOptions)
                    .subscribe((response: any) => {
                        this.role = response['response'];
                        this.onRoleChanged.next(this.role);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(role: Role) {
        return this._httpClient.post(this.serviceURL + '/save', role, this.httpOptions);
    }

    update(role: Role) {
        return this._httpClient.put(this.serviceURL + '/update', role, this.httpOptions);
    }

}
