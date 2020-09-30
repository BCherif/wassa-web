import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {User} from '../../../data/models/user.model';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';

@Injectable({
    providedIn: 'root'
})
export class UsersService implements Resolve<any> {
    users: User[];
    onUsersChanged: BehaviorSubject<any>;

    readonly serviceURL: string;
    readonly httpOptions: any;

    /**
     *
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        this.serviceURL = environment.serviceUrl + '/users';
        this.httpOptions = new TuwindiUtils().httpHeaders();

        // Set the defaults
        this.onUsersChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getUsers()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getUsers(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((resBody: any) => {
                    if (resBody['status'] === 'OK') {
                        this.users = resBody['response'];
                        this.onUsersChanged.next(this.users);
                        resolve(resBody['response']);
                    }
                }, reject);
        });
    }

}
