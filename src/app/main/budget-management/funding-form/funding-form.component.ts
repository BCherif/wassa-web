import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Partner} from '../../../data/models/partner.model';
import {PartnersService} from '../../configuration/partners/partners.service';
import {METHOD_OF_PAYMENT} from '../../../data/enums/enums';
import {Router} from '@angular/router';
import {BudgetLine} from '../../../data/models/budget.ligne.model';
import {Funding} from '../../../data/models/funding.model';
import {FundingService} from '../../../services/funding.service';

@Component({
    selector: 'budget-management-funding-form',
    templateUrl: './funding-form.component.html',
    styleUrls: ['./funding-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FundingFormComponent {
    action: string;
    budgetLine: BudgetLine;
    funding: Funding;
    partners: Partner[];
    partner: Partner;
    financingForm: FormGroup;
    dialogTitle: string;
    methods: any[];
    methodOfLinePartnerEnum = METHOD_OF_PAYMENT;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FundingFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _fundingService
     * @param _toast
     * @param _spinnerService
     * @param _partnersService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<FundingFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _fundingService: FundingService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _partnersService: PartnersService,
        private _router: Router
    ) {
        // Set the defaults
        this.action = _data.action;
        this.funding = new Funding();

        if (this.action === 'issue') {
            this.dialogTitle = 'Emission d\'un financement';
            this.funding.line = _data.budgetLine;
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
            id: new FormControl(this.funding?.id),
            line: new FormControl(this.funding?.line),
            partner: new FormControl(this.funding?.partner, Validators.required),
            amount: new FormControl('', Validators.required),
            date: new FormControl(this.funding?.date, Validators.required),
            methodOfPayment: new FormControl(this.funding?.methodOfPayment, Validators.required),
            stayToFinanced: new FormControl(this.funding.line ? this.funding.line.stayToFinanced : 0),
            total: new FormControl(this.funding.line ? this.funding.line.amount : 0)
        });
        this.updateAmounts();
    }

    checkAmountFinance(value) {
        if (value) {
            let amount = Number.parseInt(value.replace(/ /g, ''));
            if (amount < this.funding.line.stayToFinanced) {
                this.financingForm.get('amount').setValue(amount);
            } else {
                this.financingForm.get('amount').setValue(this.funding.line.stayToFinanced);
                this._toast.warning('Le montant ne peut pas depasser le reste à financer');
            }
        } else {
            this.financingForm.get('amount').setValue(0);
        }
        this.updateAmounts();
    }

    updateAmounts() {
        let amount = this.financingForm.get('amount').value;
        let newStayToFinanced = this.funding.line.stayToFinanced - amount;
        this.financingForm.get('stayToFinanced').setValue(newStayToFinanced);
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
        this.funding = this.financingForm.getRawValue();
        this.funding.partner = this.partner;
        this._fundingService.create(this.funding).subscribe(data => {
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

}
