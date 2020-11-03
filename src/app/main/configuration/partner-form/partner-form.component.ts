import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Category} from '../../../data/models/category.model';
import {ListResponseBody} from '../../../utils/list-response-body';
import {Partner} from '../../../data/models/partner.model';
import {PartnersService} from '../partners/partners.service';

@Component({
    selector: 'configuration-partner-form-dialog',
    templateUrl: './partner-form.component.html',
    styleUrls: ['./partner-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PartnerFormComponent {
    action: string;
    partner: Partner;
    partnerForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PartnerFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _partnersService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<PartnerFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _partnersService: PartnersService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un partenaire';
            this.partner = _data.partner;
        } else {
            this.dialogTitle = 'Ajouter une partenaire';
            this.partner = new Partner({});
        }

        this.partnerForm = this.createPartnerForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create partner form
     *
     * @returns {FormGroup}
     */
    createPartnerForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.partner.id],
            name: [this.partner.name],
            contact: [this.partner.contact],
            country: [this.partner.country]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.partner = new Partner();
        this.partner = this.partnerForm.getRawValue();
        if (!this.partner.id) {
            this._partnersService.save(this.partner).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._partnersService.getPartners(this._partnersService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Partner>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        } else {
            this._partnersService.update(this.partner).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._partnersService.getPartners(this._partnersService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Partner>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        }
    }

    closeDialog() {
        this._partnersService.getPartners(this._partnersService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Partner>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
