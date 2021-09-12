import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WassaUtils} from '../utils/wassa-utils';

@Injectable({
    providedIn: 'root'
})
export class PrivilegeService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        let tuwindiUtils = new WassaUtils();
        this.serviceURL = environment.serviceUrl + '/permissions';
        this.httpOptions = tuwindiUtils.httpHeaders();
    }

    findAll(): Observable<any> {
        return this.http.get(this.serviceURL, this.httpOptions);
    }

}
