import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {Observable} from 'rxjs';
import {Forecast} from '../data/models/forecast.model';
import {SearchBody} from '../utils/search-body';
import {ForecastSaveEntity} from '../utils/forecast-save-entity';

@Injectable({
    providedIn: 'root'
})
export class ForecastService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/forecasts';
        this.httpOptions = new TuwindiUtils().httpHeaders();
    }

    create(forecast: Forecast): Observable<any> {
        return this.http.post(this.serviceURL + '/create', forecast, this.httpOptions);
    }

    save(forecastSaveEntity: ForecastSaveEntity): Observable<any> {
        return this.http.post(this.serviceURL, forecastSaveEntity, this.httpOptions);
    }

    findByDateAndLineId(searchBody: SearchBody): Observable<any> {
        return this.http.post(this.serviceURL + '/search-by-date', searchBody, this.httpOptions);
    }

    getForecasts(id: number) {
        return this.http.get(this.serviceURL + '/lineId/' + id, this.httpOptions);
    }

    getAmountToStay(id: number) {
        return this.http.get(this.serviceURL + '/amountToStay/' + id, this.httpOptions);
    }

}
