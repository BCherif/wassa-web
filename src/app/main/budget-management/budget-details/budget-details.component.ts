import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Budget} from '../../../data/models/budget.model';
import {BudgetLine} from '../../../data/models/budget.ligne.model';
import {BudgetDetailsService} from './budget-details.service';
import {BudgetLineService} from '../../../services/budget.line.service';
import {MatDialog} from '@angular/material/dialog';
import {LINE_STATE, METHOD_OF_PAYMENT} from '../../../data/enums/enums';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Funding} from '../../../data/models/funding.model';
import {FundingService} from '../../../services/funding.service';
import {FundingFormComponent} from '../funding-form/funding-form.component';
import {ExpenseService} from '../../../services/expense.service';
import {LineBody} from '../../../utils/line-body';
import {AddSubLineFormComponent} from '../add-sub-line-form/add-sub-line-form.component';
import {AddForecastFormComponent} from '../add-forecast-form/add-forecast-form.component';


@Component({
    selector: 'budget-management-budget-details',
    templateUrl: './budget-details.component.html',
    styleUrls: ['./budget-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BudgetDetailsComponent implements OnInit, OnDestroy {
    budget: Budget;
    budgetLines: BudgetLine[] = [];
    fundings: Funding[] = [];
    lineBodies: LineBody[] = [];
    lineState = LINE_STATE;
    methodOfPaymentEnum = METHOD_OF_PAYMENT;

    dialogRef: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _budgetDetailsService
     * @param _budgetLineService
     * @param _fundingService
     * @param {FormBuilder} _formBuilder
     * @param _spinnerService
     * @param _toast
     * @param _router
     * @param _expenseService
     * @param _matDialog
     */
    constructor(
        private _budgetDetailsService: BudgetDetailsService,
        private _budgetLineService: BudgetLineService,
        private _fundingService: FundingService,
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
        this._budgetDetailsService.onBudgetChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(budget => {
                this.budget = new Budget(budget);
                this.findAllLines(this.budget.id);
                this.findAllFundings(this.budget.id);
                this.findAllLineBodies(this.budget.id);
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

    findAllLines(id: number) {
        this._budgetLineService.getLines(id).subscribe(data => {
            this.budgetLines = data['response'];
        }, error => console.log(error));
    }

    findAllLineBodies(id: number) {
        this._budgetDetailsService.getLinesState(id).subscribe(data => {
            this.lineBodies = data['response'];
        }, error => console.log(error));
    }


    findAllFundings(id: number) {
        this._fundingService.getAllByBudgetId(id).subscribe(data => {
            this.fundings = data['response'];
        }, error => console.log(error));
    }

    issueFunding(action?: string, budgetLine?: BudgetLine) {
        this.dialogRef = this._matDialog.open(FundingFormComponent, {
            panelClass: 'funding-form-dialog',
            data: {
                budgetLine: budgetLine,
                action: action
            }
        });
    }

    addForecast(budgetLine?: BudgetLine) {
        this.dialogRef = this._matDialog.open(AddForecastFormComponent, {
            panelClass: 'add-forecast-form-dialog',
            data: {
                budgetLine: budgetLine
            }
        });
    }

    addDetails(budgetLine?: BudgetLine) {
        this.dialogRef = this._matDialog.open(AddSubLineFormComponent, {
            panelClass: 'add-sub-line-form-dialog',
            data: {
                budgetLine: budgetLine
            }
        });
    }

}
