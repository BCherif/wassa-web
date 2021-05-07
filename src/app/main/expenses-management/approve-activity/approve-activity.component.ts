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
import {ApproveActivityService} from './approve-activity.service';
import {Proforma} from '../../../data/models/proforma.model';
import {ProformaService} from '../../../services/proforma.service';

@Component({
    selector: 'expenses-management-approve-activity',
    templateUrl: './approve-activity.component.html',
    styleUrls: ['./approve-activity.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ApproveActivityComponent implements OnInit, OnDestroy {
    activity: Activity;
    budgets: Budget[];
    pageType: string;
    activityForm: FormGroup;
    choiceForm: FormGroup;
    expenses: Expense[] = [];
    utils = new TuwindiUtils();
    proformaFiles: Proforma[];
    proformaSelected: Proforma;

    /**
     * Boolean options
     */
    uploadDialogVisibility = false;
    choiceDialogVisibility = false;
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
     * @param _approveActivityService
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
        private _approveActivityService: ApproveActivityService,
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
        this._approveActivityService.onActivityChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(activity => {
                if (activity) {
                    this.activity = new Activity(activity);
                    this.getFiles();
                    this.getExpensesByActivityId(this.activity.id);
                }
            });
        this.approveActivityForm();
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
     * Approve activity form
     *
     * @returns {FormGroup}
     */
    approveActivityForm() {
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

    showUploadDialog(activity) {
        this.activity = activity;
        this.fileNames = '';
        this.uploadDialogVisibility = true;
    }

    showChoiceDialog(proformaFile) {
        this.proformaSelected = proformaFile;
        this.choiceDialogVisibility = true;
        this.choiceForm = this.createChoiceForm();
    }

    createChoiceForm(): FormGroup {
        return this._formBuilder.group({
            description: ['', Validators.required]
        });
    }

    closeChoiceDialog() {
        this.choiceDialogVisibility = false;
        this.getFiles();
    }

    closeUploadDialog() {
        this.uploadDialogVisibility = false;
    }

    loadFiles(event) {
        this.fileNames = '';
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = new FormData();
            for (let i = 0; i < fileList.length; i++) {
                const fichier: File = fileList[i];
                this.file.append('files', fichier, fichier.name);
                this.fileNames += fichier.name + ';';
            }
        }
    }

    upload() {
        this._spinnerService.show();
        if (this.file) {
            this._proformaService.upload(+this.activity.id, this.file).subscribe(ret => {
                    if (ret['status'] === 'OK') {
                        this.closeUploadDialog();
                        this._toast.success(ret['message']);
                        this.getFiles();
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

    valide() {
        this._spinnerService.show();
        this.proformaSelected.description = this.choiceForm.get('description').value;
        this.proformaSelected.status = true;
        this._proformaService.chooce(this.proformaSelected).subscribe(data => {
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
