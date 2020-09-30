import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {Category} from '../../../data/models/category.model';
import {PageBody} from '../../../utils/page-body';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService implements Resolve<any> {
    pageBody: PageBody;
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
        this.pageBody = new PageBody();
        this.serviceURL = environment.serviceUrl + '/categories';
        this.httpOptions = new TuwindiUtils().httpHeaders();
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
                this.getCategories(this.pageBody)
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
     */
    getCategories(page?: PageBody) {
        return this._httpClient.post(this.serviceURL + '/all', page, this.httpOptions);
    }

    save(category: Category): Observable<any> {
        return this._httpClient.post(this.serviceURL, category, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    update(category: Category): Observable<any> {
        return this._httpClient.put(this.serviceURL, category, this.httpOptions);
    }

    findAll(): Observable<any> {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }


}
