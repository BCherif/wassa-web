import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {User} from '../../../data/models/user.model';
import {UserService} from './user.service';
import {RolesService} from '../roles/roles.service';
import {Role} from '../../../data/models/role.model';
import {environment} from '../../../../environments/environment';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {NgxSpinnerService} from 'ngx-spinner';
import {Employee} from '../../../data/models/employee.model';
import {EmployeesService} from '../../staff-management/employees/employees.service';

@Component({
    selector: 'administration-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UserComponent implements OnInit, OnDestroy {
    user: User;
    pageType: string;
    userForm: FormGroup;
    roleSelected: Role;
    roles: Role[] = [];
    selectedRoleValues: Role[] = [];
    employees: Employee[];
    employee: Employee;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param _userService
     * @param _rolesService
     * @param _router
     * @param _toastrService
     * @param _employeesService
     * @param _spinnerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _rolesService: RolesService,
        private _router: Router,
        private _toastrService: ToastrService,
        private _employeesService: EmployeesService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.user = new User();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.findAllRoles();
        this.findAllEmployee();
        // Subscribe to update product on changes
        this._userService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                if (user) {
                    this.user = new User(user);
                    this.pageType = 'edit';
                    this.updateUserForm();
                } else {
                    this.pageType = 'new';
                    this.user = new User();
                    this.createUserForm();
                }
            });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    createUserForm() {
        this.userForm = this._formBuilder.group({
            id: [this.user.id],
            username: ['', Validators.required],
            password: ['', Validators.required],
            employee: ['', Validators.required],
            roles: new FormArray([])
        });
        this.addCheckboxes();
    }

    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    updateUserForm() {
        this.userForm = this._formBuilder.group({
            id: [this.user.id],
            username: [this.user.username, Validators.required],
            employee: [this.user?.employee?.id, Validators.required],
            roles: new FormArray([])
        });
        this.addCheckboxes();
    }

    findAllRoles() {
        this.selectedRoleValues = [];
        this._rolesService.findAll().subscribe(value => {
            this.roles = value['response'];
            this.addCheckboxes();
        }, error => console.log(error));
    }

    findAllEmployee() {
        this._employeesService.findAll().subscribe(value => {
            this.employees = value['response'];
        });
    }

    getEmployeeById(id: number) {
        this._employeesService.getById(id).subscribe(value => {
            this.employee = value['response'];
        });
    }

    getEmployeeSelected(value) {
        this.getEmployeeById(value);
    }

    private addCheckboxes() {
        let names = [];
        if (!this.user.roles) {
            this.user.roles = [];
        }
        this.user.roles.forEach(role => {
            names.push(role.name);
        });

        this.roles.forEach((item, i) => {
            if (names.includes(item.name)) {
                item.checked = true;
                this.itemCheek(i);
            }
            const control = new FormControl(item); // if first item set to true, else false
            (this.userForm.controls.roles as FormArray).push(control);
        });

    }

    selectAll(event: MatCheckboxChange) {
        this.selectedRoleValues = [];
        this.roles.forEach((item, i) => {
            if (event.checked) {
                item.checked = event.checked;
                this.itemCheek(i);
            } else {
                item.checked = event.checked;
            }
        });
    }


    itemCheek(i) {
        this.roleSelected = this.roles[i];
        const index = this.selectedRoleValues.indexOf(this.roleSelected);
        if (index >= 0) {
            this.selectedRoleValues.splice(index, 1);
        } else {
            this.selectedRoleValues.push(this.roleSelected);
        }
    }


    /**
     * save Or update role
     */
    save(): void {
        this._spinnerService.show();
        this.user = this.userForm.getRawValue();
        this.user.employee = this.employee;
        this.user.roles = this.selectedRoleValues;
        this._userService.save(this.user).subscribe((response: any) => {
            if (response['status'] == 'OK') {
                this._userService.onUserChanged.next(this.user);
                this._toastrService.success(response['message'], 'Utilisateur');
                this._router.navigateByUrl('/main/administration/users');
                this._spinnerService.hide();
            } else {
                this._toastrService.error(response['message']);
                this._spinnerService.hide();
            }
        }, e => {
            this._toastrService.error(environment.errorMessage);
            this._spinnerService.hide();
        });

    }

    update() {
        this.user = this.userForm.getRawValue();
        this.user.employee = this.employee;
        this.user.roles = this.selectedRoleValues;
        this._userService.update(this.user).subscribe((response: any) => {
            if (response['status'] == 'OK') {
                this._userService.onUserChanged.next(this.user);
                this._toastrService.success(response['message'], 'Utilisateur');
                this._router.navigateByUrl('/main/administration/users');
                this._spinnerService.hide();
            } else {
                this._toastrService.error(response['message']);
                this._spinnerService.hide();
            }
        }, e => {
            this._toastrService.error(environment.errorMessage);
            this._spinnerService.hide();
        });
    }

}
