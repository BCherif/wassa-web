import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Activity} from '../../../data/models/activity.model';
import {Budget} from '../../../data/models/budget.model';
import {BudgetsService} from '../../budget-management/budgets/budgets.service';
import {Expense} from '../../../data/models/expense.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ExpenseService} from '../../../services/expense.service';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {Proforma} from '../../../data/models/proforma.model';
import {ProformaService} from '../../../services/proforma.service';
import {ValidateActivityService} from './validate-activity.service';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'expenses-management-validate-activity',
    templateUrl: './validate-activity.component.html',
    styleUrls: ['./validate-activity.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ValidateActivityComponent implements OnInit, OnDestroy {
    activity: Activity;
    budgets: Budget[];
    activityForm: FormGroup;
    expenses: Expense[] = [];
    utils = new TuwindiUtils();
    proformaFiles: Proforma[];

    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _validateActivityService
     * @param _budgetsService
     * @param _toast
     * @param _expenseService
     * @param _proformaService
     * @param _router
     * @param _matDialog
     * @param _spinnerService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _validateActivityService: ValidateActivityService,
        private _budgetsService: BudgetsService,
        private _toast: ToastrService,
        private _expenseService: ExpenseService,
        public _proformaService: ProformaService,
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
        // Subscribe to update activity on changes
        this._validateActivityService.onActivityChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(activity => {
                if (activity) {
                    this.activity = new Activity(activity);
                    this.getFiles();
                    this.getExpensesByActivityId(this.activity.id);
                }
            });
        this.validateActivityForm();
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
     * Validate activity form
     *
     * @returns {FormGroup}
     */
    validateActivityForm() {
        this.activityForm = this._formBuilder.group({
            id: new FormControl(this.activity?.id),
            title: new FormControl({value: this.activity?.title, disabled: true}, Validators.required),
            budget: new FormControl({value: this.activity?.budget?.id, disabled: true}, Validators.required),
            startDate: new FormControl({value: this.activity?.startDate, disabled: true}, Validators.required),
            endDate: new FormControl({value: this.activity?.endDate, disabled: true}, Validators.required)
        });
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

    getAmountSum(): number {
        return this.expenses
            .map(value => value.amount)
            .reduce((sum, current) => +sum + +current, 0);
    }

    getFiles() {
        this._proformaService.getById(this.activity.id).subscribe(data => {
            this.proformaFiles = data['response'];
        }, error => console.log(error));
    }

    validate(activity: Activity) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider cette demande';
        this._spinnerService.show();
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._validateActivityService.validate(activity).subscribe(data => {
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
        });
    }

}
