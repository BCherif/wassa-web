import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {WassaUtils} from '../../../utils/wassa-utils';
import {Category} from '../../../data/models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService implements Resolve<any> {
    categories: Category[];
    onCategoriesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/categories';
        // Set the defaults
        this.onCategoriesChanged = new BehaviorSubject({});
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
                this.getCategories()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get categories
     *
     * @returns {Promise<any>}
     */
    getCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['ok'] === true) {
                        this.categories = res['data'];
                        this.onCategoriesChanged.next(this.categories);
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

    create(category: Category) {
        return this._httpClient.post(this.serviceURL, category, this.httpOptions);
    }

    update(uid: any, category: Category) {
        return this._httpClient.put(this.serviceURL + '/' + uid, category, this.httpOptions);
    }
}
