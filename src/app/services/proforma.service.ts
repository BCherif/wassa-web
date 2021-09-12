import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {WassaUtils} from '../utils/wassa-utils';
import {Observable} from 'rxjs';
import {Proforma} from '../data/models/proforma.model';

@Injectable({
    providedIn: 'root'
})
export class ProformaService {

    readonly serviceURL: string;
    readonly httpOptions: any;
    readonly uploadOption: any;

    constructor(private _httpClient: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/proformas';
        this.httpOptions = new WassaUtils().httpHeaders();
        this.uploadOption = new WassaUtils().uploadOption();
    }

    /**
     * UPLOAD FILE
     */
    upload(id: number, obj: FormData) {
        return this._httpClient.post(this.serviceURL + '/approve?id=' + id, obj, this.uploadOption);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    chooce(proforma: Proforma): Observable<any> {
        return this._httpClient.post(this.serviceURL + '/chooce', proforma, this.httpOptions);
    }
}
