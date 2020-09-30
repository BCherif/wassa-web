import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TuwindiUtils} from '../utils/tuwindi-utils';
import {PageBody} from '../utils/page-body';
import {Observable} from 'rxjs';
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class BudgetLineService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        this.serviceURL = environment.serviceUrl + '/budget-lines';
        this.httpOptions = new TuwindiUtils().httpHeaders();
    }

    findAllByBudgetId(page?: PageBody) {
        return this.http.post(this.serviceURL + '/by-budget', page, this.httpOptions);
    }

    downloadCsv(id?: number): Observable<ArrayBuffer> {
        return this.http.get(this.serviceURL + '/download/' + id, this.httpOptions);
    }

    downloadFile(id: number) {
        FileSaver.saveAs(this.serviceURL + '/download/' + id, 'FormatStandard.xlsx');
    }
}
