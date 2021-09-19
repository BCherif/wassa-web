import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WassaUtils} from '../utils/wassa-utils';

@Injectable({
    providedIn: 'root'
})
export class CommuneService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/communes';
        this.httpOptions = new WassaUtils().httpHeaders();
    }

    getCommunesByCercleId(id: number): Observable<any> {
        return this.http.get(this.serviceURL + '/cercleId/' + id, this.httpOptions);
    }

}
