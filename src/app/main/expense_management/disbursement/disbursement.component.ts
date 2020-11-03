import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {BudgetLigne} from '../../../data/models/budget.ligne.model';
import {Router} from '@angular/router';
import {Spend} from '../../../data/models/spend.model';
import {SpendsService} from '../spends/spends.service';

@Component({
    selector: 'expense_management-disbursement',
    templateUrl: './disbursement.component.html',
    styleUrls: ['./disbursement.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DisbursementComponent {
    action: string;
    budgetLigne: BudgetLigne;
    spend: Spend;
    spendForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<DisbursementComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _spendsService
     * @param _toast
     * @param _spinnerService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<DisbursementComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _spendsService: SpendsService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _router: Router
    ) {
        // Set the defaults
        this.action = _data.action;
        this.spend = new Spend();

        if (this.action === 'issue') {
            this.dialogTitle = 'Décaissement';
            this.spend.budgetLine = _data.budgetLigne;
            this.disbursementForm();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * disbursement form
     *
     * @returns {FormGroup}
     */
    disbursementForm() {
        this.spendForm = this._formBuilder.group({
            id: new FormControl(this.spend?.id),
            label: new FormControl(this.spend?.label, Validators.required),
            budgetLine: new FormControl(this.spend?.budgetLine),
            amount: new FormControl('', Validators.required),
            date: new FormControl(this.spend?.date, Validators.required),
        });
    }

    disbursement() {
        this._spinnerService.show();
        if (this.spendForm.get('amount').value <= 0) {
            this._toast.error('Le montant à Décaisser est toujours superieur à 0');
            return;
        }
        this.spend = this.spendForm.getRawValue();
        this._spendsService.disbursement(this.spend).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toast.success(data['message']);
                this._router.navigateByUrl('/main/expense_management/spends');
                this.matDialogRef.close();
                this._spinnerService.hide();
            } else {
                this._toast.error(data['message']);
                this.matDialogRef.close();
                this._spinnerService.hide();
            }
        });
    }

    /* saveOrUpdate() {
         this._spinnerService.show();
         this.category = new Category();
         this.category = this.categoryForm.getRawValue();
         if (!this.category.id) {
             this._categoriesService.save(this.category).subscribe(data => {
                 if (data['status'] === 'OK') {
                     this._toast.success(data['message']);
                     this._categoriesService.getCategories(this._categoriesService.pageBody).subscribe(data => {
                         const listResponseBody = new ListResponseBody<Category>();
                         listResponseBody.content = data['content'];
                         listResponseBody.totalElements = data['totalElements'];
                         this.matDialogRef.close(listResponseBody);
                         this._spinnerService.hide();
                     });
                 } else {
                     this._toast.error(data['message']);
                     this._spinnerService.hide();
                     this.matDialogRef.close();
                 }
             });
         } else {
             this._categoriesService.update(this.category).subscribe(data => {
                 if (data['status'] === 'OK') {
                     this._toast.success(data['message']);
                     this._categoriesService.getCategories(this._categoriesService.pageBody).subscribe(data => {
                         const listResponseBody = new ListResponseBody<Category>();
                         listResponseBody.content = data['content'];
                         listResponseBody.totalElements = data['totalElements'];
                         this.matDialogRef.close(listResponseBody);
                         this._spinnerService.hide();
                     });
                 } else {
                     this._toast.error(data['message']);
                     this._spinnerService.hide();
                     this.matDialogRef.close();
                 }
             });
         }
     }*/
}
