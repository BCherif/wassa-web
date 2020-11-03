import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {PageBody} from '../../../utils/page-body';
import {Job} from '../../../data/models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobsService implements Resolve<any> {
    pageBody: PageBody;
    jobs: Job[];
    onJobsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/jobs';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        // Set the defaults
        this.onJobsChanged = new BehaviorSubject({});
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
                this.getJobs(this.pageBody)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get jobs
     *
     */
    getJobs(page?: PageBody) {
        return this._httpClient.post(this.serviceURL + '/all', page, this.httpOptions);
    }

    save(job: Job): Observable<any> {
        return this._httpClient.post(this.serviceURL, job, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    update(job: Job): Observable<any> {
        return this._httpClient.put(this.serviceURL, job, this.httpOptions);
    }

    findAll(): Observable<any> {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }
}
