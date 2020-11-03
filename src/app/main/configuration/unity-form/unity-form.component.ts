import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Category} from '../../../data/models/category.model';
import {ListResponseBody} from '../../../utils/list-response-body';
import {Unity} from '../../../data/models/unity.model';
import {UnitsService} from '../units/units.service';
import {TYPE_UNITY} from '../../../data/enums/enums';

@Component({
    selector: 'configuration-unity-form-dialog',
    templateUrl: './unity-form.component.html',
    styleUrls: ['./unity-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UnityFormComponent {
    action: string;
    unity: Unity;
    unityForm: FormGroup;
    dialogTitle: string;

    type = TYPE_UNITY;
    typeUnities: any[];

    /**
     * Constructor
     *
     * @param {MatDialogRef<UnityFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _unitsService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<UnityFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _unitsService: UnitsService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une unité';
            this.unity = _data.unity;
        } else {
            this.dialogTitle = 'Ajouter une unité';
            this.unity = new Unity({});
        }
        this.typeUnities = Object.keys(this.type);
        this.unityForm = this.createUnityForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create unity form
     *
     * @returns {FormGroup}
     */
    createUnityForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.unity.id],
            title: [this.unity.title],
            typeUnity: [this.unity.typeUnity]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.unity = new Unity();
        this.unity = this.unityForm.getRawValue();
        if (!this.unity.id) {
            this._unitsService.save(this.unity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._unitsService.getUnits(this._unitsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Unity>();
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
            this._unitsService.update(this.unity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._unitsService.getUnits(this._unitsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Unity>();
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
        this._unitsService.getUnits(this._unitsService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Unity>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
