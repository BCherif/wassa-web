import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Demand} from '../../../data/models/demand.model';
import {ApproveDemandService} from './approve-demand.service';
import {ToastrService} from 'ngx-toastr';
import {BudgetsService} from '../../budget-management/budgets/budgets.service';
import {Budget} from '../../../data/models/budget.model';
import {DemandFileService} from '../../../services/demand.file.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DemandFile} from '../../../data/models/demand.file.model';
import {Router} from '@angular/router';

@Component({
    selector: 'staff_management-approve-demand',
    templateUrl: './approve-demand.component.html',
    styleUrls: ['./approve-demand.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ApproveDemandComponent implements OnInit, OnDestroy {
    demand: Demand;
    pageType: string;
    demandForm: FormGroup;
    choiceForm: FormGroup;
    budgets: Budget[];
    budget: Budget;
    demandFiles: DemandFile[];
    demandFileSelected: DemandFile;

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
     * @param _approveDemandService
     * @param {FormBuilder} _formBuilder
     * @param _toast
     * @param _router
     * @param _budgetService
     * @param _demandFileService
     * @param _spinnerService
     */
    constructor(
        private _approveDemandService: ApproveDemandService,
        private _formBuilder: FormBuilder,
        private _toast: ToastrService,
        private _router: Router,
        private _budgetService: BudgetsService,
        public _demandFileService: DemandFileService,
        private _spinnerService: NgxSpinnerService
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
        this.getBudgets();
        // Subscribe to update product on changes
        this._approveDemandService.onDemandChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(demand => {
                this.demand = new Demand(demand);
                this.getFiles();
                this.demandForm = this.createDemandForm();
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

    /**
     * Create demand form
     *
     * @returns {FormGroup}
     */
    createDemandForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.demand.id],
            title: [this.demand?.title],
            demandDate: [this.demand?.demandDate],
            description: [this.demand?.description],
            budget: [this.demand?.budget?.id]
        });
    }

    createChoiceForm(): FormGroup {
        return this._formBuilder.group({
            description: ['', Validators.required]
        });
    }

    getBudgets() {
        this._budgetService.findAll().subscribe(data => {
            this.budgets = data['response'];
        }, error => console.log(error));
    }

    getFiles() {
        this._demandFileService.getById(this.demand.id).subscribe(data => {
            this.demandFiles = data['response'];
        }, error => console.log(error));
    }

    onBudgetSelected(id: number) {
        this._budgetService.getById(id).subscribe(data => {
            this.budget = data['response'];
        }, error => console.log(error));
    }

    showUploadDialog(demand) {
        this.demand = demand;
        this.fileNames = '';
        this.uploadDialogVisibility = true;
    }

    showChoiceDialog(demandFile) {
        this.demandFileSelected = demandFile;
        this.choiceDialogVisibility = true;
        this.choiceForm = this.createChoiceForm();
    }

    closeChoiceDialog() {
        this.choiceDialogVisibility = false;
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
            console.log('file : ' + this.file);
        }
    }

    upload() {
        this._spinnerService.show();
        if (this.file) {
            this._demandFileService.upload(+this.demand.id, this.file).subscribe(ret => {
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
        this.demandFileSelected.description = this.choiceForm.get('description').value;
        this.demandFileSelected.status = true;
        this._demandFileService.chooce(this.demandFileSelected).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toast.success(data['message']);
                this._router.navigateByUrl('/main/staff_management/demands');
                this._spinnerService.hide();
            } else {
                this._toast.error(data['message']);
                this._spinnerService.hide();
            }
        });
    }

}
