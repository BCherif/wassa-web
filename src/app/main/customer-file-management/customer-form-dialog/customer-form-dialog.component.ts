import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerForm} from '../../../data/models/customer.form.model';
import {CustomerFormService} from '../customer-form/customer-form.service';
import {STATE} from '../../../data/enums/enums';

@Component({
    selector: 'customer-file-management-category-form-dialog',
    templateUrl: './customer-form-dialog.component.html',
    styleUrls: ['./customer-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CustomerFormDialogComponent {
    action: string;
    customerForm: CustomerForm;
    formCustomer: FormGroup;
    dialogTitle: string;

    customerState = STATE;
    stateSelected: STATE;
    states: any[];


    /**
     * Constructor
     *
     * @param {MatDialogRef<CustomerFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _customerFormService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<CustomerFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _customerFormService: CustomerFormService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        this.states = Object.keys(this.customerState);
        // Set the defaults
        this.dialogTitle = 'Changement d\'état';
        this.customerForm = _data.customerForm;
        this.createCustomerForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create category form
     *
     */
    createCustomerForm() {
        this.formCustomer = this._formBuilder.group({
            id: new FormControl(this.customerForm?.id),
            lastName: new FormControl(this.customerForm?.lastName),
            firstName: new FormControl(this.customerForm?.firstName),
            category: new FormControl(this.customerForm?.category?.category),
            contactId: new FormControl(this.customerForm?.contactId),
            canal: new FormControl(this.customerForm?.canal),
            region: new FormControl(this.customerForm?.region?.libelle),
            cercle: new FormControl(this.customerForm?.cercle?.libelle),
            commune: new FormControl(this.customerForm?.commune?.libelle),
            vfq: new FormControl(this.customerForm?.vfq?.libelle),
            description: new FormControl(this.customerForm?.description),
            state: new FormControl(this.customerForm?.state, Validators.required),
        });
    }

    changeState(value: any) {
        this.stateSelected = value;
    }

    update() {
        this._spinnerService.show();
        this.customerForm.state = this.stateSelected;
        this._customerFormService.update(this.stateSelected, this.customerForm).subscribe(data => {
            if (data['ok'] === true) {
                this._toastr.success(data['message']);
                this.matDialogRef.close();
                this._spinnerService.hide();
            } else {
                this._toastr.error(data['message']);
                this.matDialogRef.close();
                this._spinnerService.hide();
            }
        });
    }

}
