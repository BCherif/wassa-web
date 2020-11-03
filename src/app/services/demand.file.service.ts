import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {Demand} from '../data/models/demand.model';
import {Observable} from 'rxjs';
import {DemandFile} from '../data/models/demand.file.model';

@Injectable({
    providedIn: 'root'
})
export class DemandFileService {

    readonly serviceURL: string;
    readonly httpOptions: any;
    readonly uploadOption: any;

    constructor(private _httpClient: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/demandFiles';
        this.httpOptions = new TuwindiUtils().httpHeaders();
        this.uploadOption = new TuwindiUtils().uploadOption();
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

    chooce(demandFile: DemandFile): Observable<any> {
        return this._httpClient.post(this.serviceURL+'/chooce', demandFile, this.httpOptions);
    }
}
