import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WassaUtils} from '../utils/wassa-utils';

@Injectable({
    providedIn: 'root'
})
export class VfqService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/vfqs';
        this.httpOptions = new WassaUtils().httpHeaders();
    }

    getVfqByCercleId(id: number): Observable<any> {
        return this.http.get(this.serviceURL + '/communeId/' + id, this.httpOptions);
    }

}
