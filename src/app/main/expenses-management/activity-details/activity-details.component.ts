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
import {MatDialog} from '@angular/material/dialog';
import {ExpenseService} from '../../../services/expense.service';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {ActivityDetailsService} from './activity-details.service';
import {EXPENSE_STATE} from '../../../data/enums/enums';

@Component({
    selector: 'expenses-management-activity-details',
    templateUrl: './activity-details.component.html',
    styleUrls: ['./activity-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ActivityDetailsComponent implements OnInit, OnDestroy {
    activity: Activity;
    expense: Expense;
    budgets: Budget[];
    activityForm: FormGroup;
    expenses: Expense[] = [];
    utils = new TuwindiUtils();

    expenseState = EXPENSE_STATE;

    uploadDialogVisibility = false;
    /**
     * Upload Options
     */
    file: FormData;
    files: FormData[];
    fileNames = '';


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _activityDetailsService
     * @param _budgetsService
     * @param _toast
     * @param _expenseService
     * @param _router
     * @param _matDialog
     * @param _spinnerService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _activityDetailsService: ActivityDetailsService,
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
        // Subscribe to update activity on changes
        this._activityDetailsService.onActivityDetailsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(activity => {
                if (activity) {
                    this.activity = new Activity(activity);
                    this.getExpensesByActivityId(this.activity.id);
                }
            });
        this.detailsActivityForm();
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
     * details activity form
     *
     * @returns {FormGroup}
     */
    detailsActivityForm() {
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

    showUploadDialog(expense) {
        this.expense = expense;
        this.fileNames = '';
        this.uploadDialogVisibility = true;
    }

    closeUploadDialog() {
        this.uploadDialogVisibility = false;
        this.getExpensesByActivityId(this.activity.id);
    }

    loadFiles(event) {
        this.fileNames = '';
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = new FormData();
            for (let i = 0; i < fileList.length; i++) {
                const fichier: File = fileList[i];
                this.file.append('file', fichier, fichier.name);
                this.fileNames += fichier.name + ';';
            }
        }
    }

    validate() {
        this._spinnerService.show();
        if (this.file) {
            this._expenseService.upload(+this.expense.id, this.file).subscribe(ret => {
                    if (ret['status'] === 'OK') {
                        this._toast.success(ret['message']);
                        this.closeUploadDialog();
                        this._spinnerService.hide();
                    } else {
                        this._toast.error(ret['message']);
                        this.closeUploadDialog();
                        this._spinnerService.hide();
                    }
                },
                error => {
                    this.closeUploadDialog();
                    this._spinnerService.hide();
                });
        }
    }


}
