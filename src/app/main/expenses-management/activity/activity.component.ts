import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Activity} from '../../../data/models/activity.model';
import {ActivityService} from './activity.service';
import {BudgetLineService} from '../../../services/budget.line.service';
import {UnitsService} from '../../configuration/units/units.service';
import {Budget} from '../../../data/models/budget.model';
import {BudgetsService} from '../../budget-management/budgets/budgets.service';
import {Expense} from '../../../data/models/expense.model';
import {MatDialog} from '@angular/material/dialog';
import {ExpenseFormComponent} from '../expense-form/expense-form.component';
import {ActivitySaveEntity} from '../../../utils/activity-save-entity';
import {ExpenseService} from '../../../services/expense.service';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';

@Component({
    selector: 'expenses-management-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ActivityComponent implements OnInit, OnDestroy {
    activity: Activity;
    budgets: Budget[];
    pageType: string;
    activityForm: FormGroup;
    minDate: Date;
    budget: Budget;
    expenses: Expense[] = [];
    activitySaveEntity: ActivitySaveEntity;
    utils = new TuwindiUtils();

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param activityService
     * @param _budgetLineService
     * @param _unitsService
     * @param _budgetsService
     * @param _toast
     * @param _expenseService
     * @param _router
     * @param _matDialog
     * @param _spinnerService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private activityService: ActivityService,
        private _budgetLineService: BudgetLineService,
        private _unitsService: UnitsService,
        private _budgetsService: BudgetsService,
        private _toast: ToastrService,
        private _expenseService: ExpenseService,
        private _router: Router,
        private _matDialog: MatDialog,
        private _spinnerService: NgxSpinnerService,
        private _formBuilder: FormBuilder
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
        this.getAllBudgets();
        // Subscribe to update product on changes
        this.activityService.onActivityChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(activity => {
                if (activity) {
                    this.activity = new Activity(activity);
                    this.budget = this.activity.budget;
                    this.getExpensesByActivityId(this.activity.id);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.activity = new Activity();
                }
            });
        this.createActivityForm();
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
    createActivityForm() {
        this.activityForm = this._formBuilder.group({
            id: new FormControl(this.activity?.id),
            title: new FormControl(this.activity?.title, Validators.required),
            budget: new FormControl(this.activity?.budget?.id, Validators.required),
            startDate: new FormControl(this.activity?.startDate, Validators.required),
            endDate: new FormControl(this.activity?.endDate, Validators.required)
        });
    }

    /**
     * Add new line expense row into form
     */
    addExpense(action?: string, budget?: Budget) {
        const dialogRef = this._matDialog.open(ExpenseFormComponent, {
            panelClass: 'expense-form-dialog',
            data: {
                budget: budget,
                action: action
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.expenses.push(result);
            }
        });
    }

    editExpense(expense?: Expense) {
        const dialogRef = this._matDialog.open(ExpenseFormComponent, {
            panelClass: 'expense-form-dialog',
            data: {
                expense: expense
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.showUpdatedItem(result);
            }
        });
    }

    addEvent(event) {
        let selectedDate = new Date();
        if (event) {
            selectedDate = new Date(event.value);
            this.minDate = new Date(selectedDate);
        }
    }

    getAllBudgets() {
        this._budgetsService.findAll().subscribe(data => {
            this.budgets = data['response'];
        }, error => console.log(error));
    }

    getExpensesByActivityId(id: number) {
        this._expenseService.getAllByActivityId(id).subscribe(data => {
            this.expenses = data['response'];
        }, error => console.log(error));
    }

    onBudgetSelected(id: number) {
        this._budgetsService.getById(id).subscribe(data => {
            this.budget = data['response'];
        }, error => console.log(error));
    }

    deleteLine(index: number) {
        this.expenses.splice(index, 1);
        this.getAmountSum();
    }

    getAmountSum(): number {
        return this.expenses
            .map(value => value.amount)
            .reduce((sum, current) => +sum + +current, 0);
    }

    showUpdatedItem(newItem) {
        let updateItem = this.expenses.find(this.findIndexToUpdate, newItem.id);

        let index = this.expenses.indexOf(updateItem);

        this.expenses[index] = newItem;

    }

    findIndexToUpdate(newItem) {
        return newItem.id === this;
    }


    save() {
        this._spinnerService.show();
        this.activitySaveEntity = new ActivitySaveEntity();
        this.activity.title = this.activityForm.get('title').value;
        this.activity.startDate = this.activityForm.get('startDate').value;
        this.activity.endDate = this.activityForm.get('endDate').value;
        this.activity.budget = this.budget;
        this.activity.createBy = this.utils.getAppUser();
        this.activitySaveEntity.activity = this.activity;
        this.activitySaveEntity.expenses = this.expenses;
        if (!this.activity.id) {
            this.activityService.create(this.activitySaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._router.navigateByUrl('/main/expenses-management/activities');
                    this._spinnerService.hide();
                } else {
                    this._toast.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        } else {
            this.activityService.update(this.activity.id, this.activitySaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._router.navigateByUrl('/main/expenses-management/activities');
                    this._spinnerService.hide();
                } else {
                    this._toast.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        }
    }
}
