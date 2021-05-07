import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {BudgetLine} from '../../../data/models/budget.ligne.model';
import {LineDetailsService} from './line-details.service';
import {MatDialog} from '@angular/material/dialog';
import {LINE_STATE, METHOD_OF_PAYMENT} from '../../../data/enums/enums';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Funding} from '../../../data/models/funding.model';
import {FundingService} from '../../../services/funding.service';
import {ExpenseService} from '../../../services/expense.service';
import {SubLine} from '../../../data/models/sub.line.model';
import {Forecast} from '../../../data/models/forecast.model';
import {Expense} from '../../../data/models/expense.model';
import {ForecastService} from '../../../services/forecast.service';
import {SubLineService} from '../../../services/sub.line.service';


@Component({
    selector: 'budget-management-line-details',
    templateUrl: './line-details.component.html',
    styleUrls: ['./line-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LineDetailsComponent implements OnInit, OnDestroy {
    budgetLine: BudgetLine;
    subLines: SubLine[] = [];
    fundings: Funding[] = [];
    forecasts: Forecast[] = [];
    expenses: Expense[] = [];
    lineState = LINE_STATE;
    methodOfPaymentEnum = METHOD_OF_PAYMENT;

    dialogRef: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _lineDetailsService
     * @param _forecastService
     * @param _fundingService
     * @param _subLineService
     * @param {FormBuilder} _formBuilder
     * @param _spinnerService
     * @param _toast
     * @param _router
     * @param _expenseService
     * @param _matDialog
     */
    constructor(
        private _lineDetailsService: LineDetailsService,
        private _forecastService: ForecastService,
        private _fundingService: FundingService,
        private _subLineService: SubLineService,
        private _formBuilder: FormBuilder,
        private _spinnerService: NgxSpinnerService,
        private _toast: ToastrService,
        private _router: Router,
        private _expenseService: ExpenseService,
        public _matDialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to update budget on changes
        this._lineDetailsService.onBudgetLineChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(budgetLine => {
                this.budgetLine = new BudgetLine(budgetLine);
                this.findAllForecasts(this.budgetLine.id);
                this.findAllExpenses(this.budgetLine.id);
                this.findAllFundings(this.budgetLine.id);
                this.findAllSubLines(this.budgetLine.id);
            });

    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    findAllForecasts(id: number) {
        this._forecastService.getForecasts(id).subscribe(data => {
            this.forecasts = data['response'];
        }, error => console.log(error));
    }

    findAllExpenses(id: number) {
        this._expenseService.getAllBylineId(id).subscribe(data => {
            this.expenses = data['response'];
        }, error => console.log(error));
    }


    findAllFundings(id: number) {
        this._fundingService.getAllByLineId(id).subscribe(data => {
            this.fundings = data['response'];
        }, error => console.log(error));
    }

    findAllSubLines(id: number) {
        this._subLineService.getSubLinesByLineId(id).subscribe(data => {
            this.subLines = data['response'];
        }, error => console.log(error));
    }


}
