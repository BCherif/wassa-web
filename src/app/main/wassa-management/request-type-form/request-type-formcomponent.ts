import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {RequestType} from '../../../data/models/request.type.model';
import {RequestTypesService} from '../request-types/request-types.service';

@Component({
    selector: 'wassa-management-request-type-formdialog',
    templateUrl: './request-type-form.component.html',
    styleUrls: ['./request-type-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RequestTypeFormDialogComponent {
    action: string;
    requestType: RequestType;
    typeForm: FormGroup;
    dialogTitle: string;


    /**
     * Constructor
     *
     * @param {MatDialogRef<RequestTypeFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _requestTypesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<RequestTypeFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _requestTypesService: RequestTypesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        this.createTypeForm();
        // Set the defaults
        this.action = _data.action;
        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un type';
            this.requestType = _data.requestType;
            this.updateTypeForm();
        } else {
            this.dialogTitle = 'Ajouter un type';
            this.requestType = new RequestType();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create type form
     *
     */
    createTypeForm() {
        this.typeForm = this._formBuilder.group({
            id: new FormControl(''),
            type: new FormControl('', Validators.required),
        });
    }


    /**
     * update type form
     *
     */
    updateTypeForm() {
        this.typeForm = this._formBuilder.group({
            id: new FormControl(this.requestType.id),
            type: new FormControl(this.requestType.type, Validators.required),
        });
    }


    saveOrUpdate() {
        this._spinnerService.show();
        this.requestType = new RequestType();
        this.requestType = this.typeForm.getRawValue();
        if (!this.requestType.id) {
            this._requestTypesService.create(this.requestType).subscribe(data => {
                if (data['ok'] === true) {
                    this._requestTypesService.getTypes();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        } else {
            this._requestTypesService.update(this.requestType.id, this.requestType).subscribe(data => {
                if (data['ok'] === true) {
                    this._requestTypesService.getTypes();
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

}
