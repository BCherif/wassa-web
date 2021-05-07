import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {fuseAnimations} from '@fuse/animations';
import {ReportsService} from '../reports.service';
import {Budget} from '../../../data/models/budget.model';
import {BudgetsService} from '../../budget-management/budgets/budgets.service';
import {ToastrService} from 'ngx-toastr';
import {SearchBody} from '../../../utils/search-body';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ReportBody} from '../../../utils/report-body';
import {Expense} from '../../../data/models/expense.model';


@Component({
    selector: 'reporting-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: fuseAnimations
})
export class ReportsComponent implements OnInit, OnDestroy {

    reportBodies: ReportBody[];
    budgets: Budget[];
    expenses: Expense[];
    minDate: Date;
    budget: Budget;
    searchBody: SearchBody;
    searchForm: FormGroup;
    objectShow = [];
    dataSource = [];


    displayedColumns = ['code', 'title', 'budgetLine', 'unity', 'quantity', 'unitPrice', 'amount'];


    // Private
    private _unsubscribeAll: Subject<any>;


    /**
     * Constructor
     *
     */
    constructor(
        private _reportsService: ReportsService,
        private _budgetsService: BudgetsService,
        private _toast: ToastrService,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.searchBody = new SearchBody();

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
        this.getAllBudgets();
        this.createSearchForm();
        this.expenses = [];
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

    /**
     * Create activity form
     *
     * @returns {FormGroup}
     */
    createSearchForm() {
        this.searchForm = this._formBuilder.group({
            budget: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required)
        });
    }

    startDateSelected(event) {
        let selectedDate = new Date(event.value);
        this.minDate = new Date(selectedDate);
        this.searchBody.startDate = selectedDate;
    }

    endDateSelected(event) {
        this.searchBody.endDate = new Date(event.value);
    }


    getAllBudgets() {
        this._budgetsService.findAll().subscribe(data => {
            this.budgets = data['response'];
        }, error => console.log(error));
    }

    onBudgetSelected(id: number) {
        this._budgetsService.getById(id).subscribe(data => {
            this.budget = data['response'];
            this.searchBody.budgetId = this.budget.id;
        }, error => console.log(error));
    }

    report() {
        this._reportsService.searchBody = this.searchBody;
        this._reportsService.getReports(this._reportsService.searchBody).subscribe(data => {
            this.reportBodies = data['response'];
            if (this.reportBodies.length) {
                this.reportBodies.forEach(value => {
                    this.objectShow.push({
                        activityName: value.activityName
                    });
                    value.expenses.forEach(elt => {
                        this.objectShow.push(elt);
                    });
                    this.expenses = value.expenses;
                });
                this.dataSource = this.objectShow;
                this.getTotalCost();
            }
        }, error => console.log(error));
    }

    isGroup(index, item): boolean {
        return item.activityName;
    }

    /** Gets the total cost of all transactions. */
    getTotalCost() {
        return this.expenses.map(t => t.amount).reduce((acc, value) => acc + value, 0);
    }

}
