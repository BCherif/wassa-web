import {Injectable} from '@angular/core';
import {BudgetLine} from '../data/models/budget.ligne.model';
import {Forecast} from '../data/models/forecast.model';

@Injectable()
export class ForecastSaveEntity {
    budgetLine: BudgetLine;
    forecasts: Forecast[];
}