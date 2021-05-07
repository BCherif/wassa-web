import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {Observable} from 'rxjs';
import {SubLineSaveEntity} from '../utils/sub-line-save-entity';

@Injectable({
    providedIn: 'root'
})
export class SubLineService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private _httpClient: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/sub-lines';
        this.httpOptions = new TuwindiUtils().httpHeaders();
    }

    save(subLineSaveEntity: SubLineSaveEntity): Observable<any> {
        return this._httpClient.post(this.serviceURL, subLineSaveEntity, this.httpOptions);
    }

    getSubLinesByLineId(id: number) {
        return this._httpClient.get(this.serviceURL + '/lineId/' + id, this.httpOptions);
    }

}
