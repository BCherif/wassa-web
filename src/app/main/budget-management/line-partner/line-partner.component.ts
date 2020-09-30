import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {BudgetLigne} from '../../../data/models/budget.ligne.model';
import {Partner} from '../../../data/models/partner.model';
import {LinePartnerService} from '../../../services/line.partner.service';
import {LinePartner} from '../../../data/models/line.partner';
import {PartnersService} from '../../configuration/partners/partners.service';
import {METHOD_OF_PAYMENT} from '../../../data/enums/enums';
import {Router} from '@angular/router';

@Component({
    selector: 'budget-management-line-partner',
    templateUrl: './line-partner.component.html',
    styleUrls: ['./line-partner.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LinePartnerComponent {
    action: string;
    budgetLigne: BudgetLigne;
    linePartner: LinePartner;
    partners: Partner[];
    partner: Partner;
    financingForm: FormGroup;
    dialogTitle: string;
    methods: any[];
    methodOfLinePartnerEnum = METHOD_OF_PAYMENT;

    /**
     * Constructor
     *
     * @param {MatDialogRef<LinePartnerComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _linePartnerService
     * @param _toast
     * @param _spinnerService
     * @param _partnersService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<LinePartnerComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _linePartnerService: LinePartnerService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _partnersService: PartnersService,
        private _router: Router
    ) {
        // Set the defaults
        this.action = _data.action;
        this.linePartner = new LinePartner();

        if (this.action === 'issue') {
            this.dialogTitle = 'Emission d\'un financement';
            this.linePartner.budgetLine = _data.budgetLigne;
            this.issueFinancingForm();
        }
        this.methods = Object.keys(this.methodOfLinePartnerEnum);
        this.getAllPartners();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * issue financing form
     *
     * @returns {FormGroup}
     */
    issueFinancingForm() {
        this.financingForm = this._formBuilder.group({
            id: new FormControl(this.linePartner?.id),
            budgetLine: new FormControl(this.linePartner?.budgetLine),
            partner: new FormControl(this.linePartner?.partner, Validators.required),
            amount: new FormControl('', Validators.required),
            financeDate: new FormControl(this.linePartner?.financeDate, Validators.required),
            methodOfPayment: new FormControl(this.linePartner?.methodOfPayment, Validators.required),
            stayToFinance: new FormControl(this.linePartner.budgetLine ? this.linePartner.budgetLine.stayToFinance : 0),
            total: new FormControl(this.linePartner.budgetLine ? this.linePartner.budgetLine.total : 0)
        });
        this.updateAmounts();
    }

    checkAmountFinance(value) {
        if (value) {
            let amount = Number.parseInt(value.replace(/ /g, ''));
            if (amount < this.linePartner.budgetLine.stayToFinance) {
                this.financingForm.get('amount').setValue(amount);
            } else {
                this.financingForm.get('amount').setValue(this.linePartner.budgetLine.stayToFinance);
                this._toast.warning('Le montant ne peut pas depasser le reste à financer');
            }
        } else {
            this.financingForm.get('amount').setValue(0);
        }
        this.updateAmounts();
    }

    updateAmounts() {
        let amount = this.financingForm.get('amount').value;
        let newStayToFinance = this.linePartner.budgetLine.stayToFinance - amount;
        this.financingForm.get('stayToFinance').setValue(newStayToFinance);
    }

    getAllPartners() {
        this._partnersService.findAll().subscribe(data => {
            this.partners = data['response'];
        }, error => console.log(error));
    }

    onPartnerSelected(id: number) {
        this._partnersService.getById(id).subscribe(data => {
            this.partner = data['response'];
        }, error => console.log(error));
    }

    save() {
        this._spinnerService.show();
        if (this.financingForm.get('amount').value <= 0) {
            this._toast.error('Le montant à financer est toujours superieur à 0');
            return;
        }
        this.linePartner = this.financingForm.getRawValue();
        this.linePartner.partner = this.partner;
        this._linePartnerService.save(this.linePartner).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toast.success(data['message']);
                this._router.navigateByUrl('/main/budget-management/budgets');
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
