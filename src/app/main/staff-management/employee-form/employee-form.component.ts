import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ListResponseBody} from '../../../utils/list-response-body';
import {EmployeesService} from '../employees/employees.service';
import {DepartmentsService} from '../../configuration/departments/departments.service';
import {Employee} from '../../../data/models/employee.model';
import {JobsService} from '../../configuration/jobs/jobs.service';
import {Job} from '../../../data/models/job.model';
import {Department} from '../../../data/models/department.model';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
    selector: 'staff_management-employee-form-dialog',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class EmployeeFormComponent {
    action: string;
    employee: Employee;
    jobs: Job[];
    departments: Department[];
    job: Job;
    department: Department;
    employeeForm: FormGroup;
    dialogTitle: string;
    matcher = new MyErrorStateMatcher();

    /**
     * Constructor
     *
     * @param {MatDialogRef<EmployeeFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _employeesService
     * @param _jobsService
     * @param _departmentsService
     * @param _toast
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<EmployeeFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _employeesService: EmployeesService,
        private _jobsService: JobsService,
        private _departmentsService: DepartmentsService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un employé';
            this.employee = _data.employee;
            this.onJobSelected(this.employee?.job?.id);
            this.onDepartmentSelected(this.employee?.department?.id);
            this.updateEmployeeForm();
        } else {
            this.dialogTitle = 'Ajouter un employé';
            this.employee = new Employee({});
            this.createEmployeeForm();
        }
        this.getAllJobs();
        this.getAllDepartments();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create employee form
     *
     * @returns {FormGroup}
     */
    createEmployeeForm() {
        this.employeeForm = this._formBuilder.group({
            id: new FormControl(''),
            lastname: new FormControl('', Validators.required),
            firstname: new FormControl('', Validators.required),
            job: new FormControl('', Validators.required),
            email: new FormControl('', [
                Validators.required,
                Validators.email,
            ]),
            telephone: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required)
        });
    }

    /**
     * update employee form
     *
     * @returns {FormGroup}
     */
    updateEmployeeForm() {
        this.employeeForm = this._formBuilder.group({
            id: new FormControl(this.employee?.id),
            lastname: new FormControl(this.employee?.lastname, Validators.required),
            firstname: new FormControl(this.employee?.firstname, Validators.required),
            job: new FormControl(this.employee?.job?.id, Validators.required),
            email: new FormControl(this.employee?.email, [
                Validators.required,
                Validators.email,
            ]),
            telephone: new FormControl(this.employee?.telephone, Validators.required),
            address: new FormControl(this.employee?.address, Validators.required),
            department: new FormControl(this.employee?.department?.id, Validators.required)
        });
    }

    getAllJobs() {
        this._jobsService.findAll().subscribe(data => {
            this.jobs = data['response'];
        }, error => console.log(error));
    }

    getAllDepartments() {
        this._departmentsService.findAll().subscribe(data => {
            this.departments = data['response'];
        }, error => console.log(error));
    }

    onJobSelected(id: number) {
        this._jobsService.getById(id).subscribe(data => {
            this.job = data['response'];
        }, error => console.log(error));
    }

    onDepartmentSelected(id: number) {
        this._departmentsService.getById(id).subscribe(data => {
            this.department = data['response'];
        }, error => console.log(error));
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.employee = new Employee();
        this.employee = this.employeeForm.getRawValue();
        this.employee.job = this.job;
        this.employee.department = this.department;
        if (!this.employee.id) {
            this._employeesService.save(this.employee).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._employeesService.getEmployees(this._employeesService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Employee>();
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
            this._employeesService.update(this.employee).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._employeesService.getEmployees(this._employeesService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Employee>();
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
        this._employeesService.getEmployees(this._employeesService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Employee>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
