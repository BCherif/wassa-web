import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WassaUtils} from '../utils/wassa-utils';

@Injectable({
    providedIn: 'root'
})
export class RegionService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/regions';
        this.httpOptions = new WassaUtils().httpHeaders();
    }

    findAll(): Observable<any> {
        return this.http.get(this.serviceURL, this.httpOptions);
    }

}
