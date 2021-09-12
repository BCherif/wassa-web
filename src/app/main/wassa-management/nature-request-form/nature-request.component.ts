import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {NatureRequest} from '../../../data/models/nature.request.model';
import {RequestType} from '../../../data/models/request.type.model';
import {NatureRequestService} from '../nature-request/nature-request.service';
import {RequestTypesService} from '../request-types/request-types.service';

@Component({
    selector: 'wassa-management-nature-request-form-dialog',
    templateUrl: './nature-request.component.html',
    styleUrls: ['./nature-request.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NatureRequestFormDialogComponent {
    action: string;
    natureRequest: NatureRequest;
    requestTypes: RequestType[] = [];
    requestType: RequestType;
    natureForm: FormGroup;
    dialogTitle: string;


    /**
     * Constructor
     *
     * @param {MatDialogRef<NatureRequestFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _natureRequestService
     * @param _requestTypesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<NatureRequestFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _natureRequestService: NatureRequestService,
        private _requestTypesService: RequestTypesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        this.getTypes();
        this.createNatureForm();
        // Set the defaults
        this.action = _data.action;
        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une nature';
            this.natureRequest = _data.natureRequest;
            this.getTypeById(this.natureRequest.requestType.id);
            this.updateNatureForm();
        } else {
            this.dialogTitle = 'Ajouter une nature';
            this.natureRequest = new NatureRequest();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create nature form
     *
     */
    createNatureForm() {
        this.natureForm = this._formBuilder.group({
            id: new FormControl(''),
            nature: new FormControl('', Validators.required),
            slaTto: new FormControl('', Validators.required),
            slaTtr: new FormControl('', Validators.required),
            requestType: new FormControl('', Validators.required),
        });
    }


    /**
     * update nature form
     *
     */
    updateNatureForm() {
        this.natureForm = this._formBuilder.group({
            id: new FormControl(this.natureRequest.id),
            nature: new FormControl(this.natureRequest.nature, Validators.required),
            slaTto: new FormControl(this.natureRequest.slaTto, Validators.required),
            slaTtr: new FormControl(this.natureRequest.slaTtr, Validators.required),
            requestType: new FormControl(this.natureRequest.requestType.id, Validators.required)
        });
    }

    getTypes() {
        this._requestTypesService.getAll().subscribe(value => {
            this.requestTypes = value['data'];
        }, error => console.log(error));
    }


    getTypeById(id: number) {
        this._requestTypesService.getById(id).subscribe(value => {
            this.requestType = value['data'];
        }, error => console.log(error));
    }


    saveOrUpdate() {
        this._spinnerService.show();
        this.natureRequest = new NatureRequest();
        this.natureRequest = this.natureForm.getRawValue();
        this.natureRequest.requestType = this.requestType;
        if (!this.natureRequest.id) {
            this._natureRequestService.create(this.natureRequest).subscribe(data => {
                if (data['ok'] === true) {
                    this._natureRequestService.getNatures();
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
            this._natureRequestService.update(this.natureRequest.id, this.natureRequest).subscribe(data => {
                if (data['ok'] === true) {
                    this._natureRequestService.getNatures();
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

    onTypeChange(value: number) {
        this.getTypeById(value);
    }
}
