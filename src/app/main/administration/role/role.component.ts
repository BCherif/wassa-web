import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Role} from '../../../data/models/role.model';
import {RoleService} from './role.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {PrivilegeService} from '../../../services/privilege.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {NgxSpinnerService} from 'ngx-spinner';
import {Permission} from '../../../data/models/permission.model';

@Component({
    selector: 'administration-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RoleComponent implements OnInit, OnDestroy {
    role: Role;
    pageType: string;
    roleForm: FormGroup;
    priviligeSelected: Permission;
    privileges: Permission[] = [];
    selectedPrivilegeValues: Permission[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param _roleService
     * @param _privilegeService
     * @param _router
     * @param _toastrService
     * @param _spinnerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _roleService: RoleService,
        private _privilegeService: PrivilegeService,
        private _router: Router,
        private _toastrService: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.role = new Role();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.findAllPrivilege();
        // Subscribe to update product on changes
        this._roleService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(role => {
                if (role) {
                    this.role = new Role(role);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.role = new Role();
                }
                this.createRoleForm();
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

    findAllPrivilege() {
        this.selectedPrivilegeValues = [];
        this._privilegeService.findAll().subscribe(value => {
            this.privileges = value['response'];
            this.addCheckboxes();
        }, error => this._toastrService.error(environment.errorNetworkMessage));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create role form
     *
     * @returns {FormGroup}
     */
    createRoleForm() {
        this.roleForm = this._formBuilder.group({
            name: [this.role.name],
            description: [this.role.description],
            privileges: new FormArray([])
        });
        this.addCheckboxes();
    }

    private addCheckboxes() {
        let names = [];
        this.role.permissions.forEach(privilege => {
            names.push(privilege.name);
        });

        this.privileges.forEach((item, i) => {
            if (names.includes(item.name)) {
                item.checked = true;
                this.itemCheek(i);
            }
            const control = new FormControl(item); // if first item set to true, else false
            (this.roleForm.controls.privileges as FormArray).push(control);
        });

    }

    selectAll(event: MatCheckboxChange) {
        this.selectedPrivilegeValues = [];
        this.privileges.forEach((item, i) => {
            if (event.checked) {
                item.checked = event.checked;
                this.itemCheek(i);
            } else {
                item.checked = event.checked;
            }
        });
    }


    itemCheek(i) {
        this.priviligeSelected = this.privileges[i];
        const index = this.selectedPrivilegeValues.indexOf(this.priviligeSelected);
        if (index >= 0) {
            this.selectedPrivilegeValues.splice(index, 1);
        } else {
            this.selectedPrivilegeValues.push(this.priviligeSelected);
        }
    }

    save(): void {
        this._spinnerService.show();
        this.role = this.roleForm.getRawValue();
        this.role.permissions = this.selectedPrivilegeValues;
        this._roleService.create(this.role).subscribe((response: any) => {
            if (response['status'] == 'OK') {
                this._roleService.onRoleChanged.next(this.role);
                this._toastrService.success(response['message'], 'Rôle');
                this._router.navigateByUrl('/main/administration/roles');
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

    update(): void {
        this._spinnerService.show();
        this.role = this.roleForm.getRawValue();
        this.role.permissions = this.selectedPrivilegeValues;
        this._roleService.update(this.role).subscribe((response: any) => {
            if (response['status'] == 'OK') {
                this._roleService.onRoleChanged.next(this.role);
                this._toastrService.success(response['message'], 'Rôle');
                this._router.navigateByUrl('/main/administration/roles');
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
