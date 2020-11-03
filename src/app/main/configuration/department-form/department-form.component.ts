import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ListResponseBody} from '../../../utils/list-response-body';
import {Department} from '../../../data/models/department.model';
import {DepartmentsService} from '../departments/departments.service';

@Component({
    selector: 'configuration-department-form-dialog',
    templateUrl: './department-form.component.html',
    styleUrls: ['./department-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DepartmentFormComponent {
    action: string;
    department: Department;
    departmentForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<DepartmentFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _departmentService
     * @param _toast
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<DepartmentFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _departmentService: DepartmentsService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un départment';
            this.department = _data.department;
        } else {
            this.dialogTitle = 'Ajouter une départment';
            this.department = new Department({});
        }

        this.departmentForm = this.createDepartmentForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create departement form
     *
     * @returns {FormGroup}
     */
    createDepartmentForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.department.id],
            name: [this.department.name],
            description: [this.department.description]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.department = new Department();
        this.department = this.departmentForm.getRawValue();
        if (!this.department.id) {
            this._departmentService.save(this.department).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._departmentService.getDepartments(this._departmentService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Department>();
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
            this._departmentService.update(this.department).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._departmentService.getDepartments(this._departmentService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Department>();
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
    }

    closeDialog() {
        this._departmentService.getDepartments(this._departmentService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Department>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
