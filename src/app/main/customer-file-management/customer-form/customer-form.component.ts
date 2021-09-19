import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {CustomerFormService} from './customer-form.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerForm} from '../../../data/models/customer.form.model';
import {Category} from '../../../data/models/category.model';
import {Region} from '../../../data/models/region.model';
import {Cercle} from '../../../data/models/cercle.model';
import {Vfq} from '../../../data/models/vfq.model';
import {CategoriesService} from '../../wassa-management/categories/categories.service';
import {RegionService} from '../../../services/region.service';
import {CercleService} from '../../../services/cercle.service';
import {VfqService} from '../../../services/vfq.service';
import {CommuneService} from '../../../services/commune.service';
import {Commune} from '../../../data/models/commune.model';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'customer-file-management-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CustomerFormComponent implements OnInit, OnDestroy {
    customerForm: CustomerForm;
    pageType: string;
    formCustomer: FormGroup;

    categories: Category[];
    category: Category;

    regions: Region[];
    region: Region;

    cercles: Cercle[];
    cercle: Cercle;

    communes: Commune[];
    commune: Commune;

    vfqs: Vfq[];
    vfq: Vfq;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param _customerFormService
     * @param _categoriesService
     * @param _regionService
     * @param _circleService
     * @param _communeService
     * @param _vfqService
     * @param _router
     * @param _toastrService
     * @param _spinnerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _customerFormService: CustomerFormService,
        private _categoriesService: CategoriesService,
        private _regionService: RegionService,
        private _circleService: CercleService,
        private _communeService: CommuneService,
        private _vfqService: VfqService,
        private _router: Router,
        private _toastrService: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.customerForm = new CustomerForm();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.findCategories();
        this.findRegions();
        // Subscribe to update product on changes
        this._customerFormService.onCustomerFormChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(customer => {
                if (customer) {
                    this.customerForm = customer;
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.customerForm = new CustomerForm();
                    this.createCustomerForm();
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
     * Create customer form
     *
     * @returns {FormGroup}
     */

    createCustomerForm() {
        this.formCustomer = this._formBuilder.group({
            id: new FormControl(''),
            lastName: new FormControl('', Validators.required),
            firstName: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required),
            contactId: new FormControl('', Validators.required),
            canal: new FormControl('', Validators.required),
            region: new FormControl('', Validators.required),
            cercle: new FormControl('', Validators.required),
            commune: new FormControl('', Validators.required),
            vfq: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
        });
    }


    findCategories() {
        this._categoriesService.getAll().subscribe(value => {
            this.categories = value['data'];
        }, error => console.log(error));
    }

    findRegions() {
        this._regionService.findAll().subscribe(value => {
            this.regions = value['data'];
        }, error => console.log(error));
    }

    findCercles(id: number) {
        this._circleService.getCerclesByRegionId(id).subscribe(value => {
            this.cercles = value['data'];
        }, error => console.log(error));
    }

    findCommunes(id: number) {
        this._communeService.getCommunesByCercleId(id).subscribe(value => {
            this.communes = value['data'];
        }, error => console.log(error));
    }

    findVfqs(id: number) {
        this._vfqService.getVfqByCercleId(id).subscribe(value => {
            this.vfqs = value['data'];
        }, error => console.log(error));
    }

    onRegionChange(value: Region) {
        this.region = value;
        this.findCercles(value.id);
    }

    onCircleChange(value: Cercle) {
        this.cercle = value;
        this.findCommunes(value.id);
    }

    onTownChange(value: Commune) {
        this.commune = value;
        this.findVfqs(value.id);
    }

    onVFQChange(value: Vfq) {
        this.vfq = value;
    }

    onCategoryChange(value: Category) {
        this.category = value;
    }

    save(): void {
        this._spinnerService.show();
        this.customerForm = this.formCustomer.getRawValue();
        this.customerForm.category = this.category;
        this.customerForm.region = this.region;
        this.customerForm.cercle = this.cercle;
        this.customerForm.commune = this.commune;
        this.customerForm.vfq = this.vfq;
        this._customerFormService.create(this.customerForm).subscribe((response: any) => {
            if (response['ok'] === true) {
                this._customerFormService.onCustomerFormChanged.next(this.customerForm);
                this._toastrService.success(response['message'], 'Fiche client');
                this._router.navigateByUrl('/main/customer-file-management/customer-forms').then();
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


    /**
     * save Or update role
     */

    /*save(): void {
        this._spinnerService.show();
        this.user = this.userForm.getRawValue();
        this.user.fullName = this.userForm.get('firstname').value + '' + this.userForm.get('lastname').value;
        this.user.roles = this.selectedRoleValues;
          this._userService.save(this.user).subscribe((response: any) => {
              if (response['ok'] === true) {
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
        console.log(this.user);

    }

    update() {
        this.user = this.userForm.getRawValue();
        this.user.roles = this.selectedRoleValues;
        this._userService.update(this.user).subscribe((response: any) => {
            if (response['ok'] === true) {
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
    }*/

}
