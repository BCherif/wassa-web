import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Demand} from '../../../data/models/demand.model';
import {DemandService} from './demand.service';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {DEMAND_STATE} from '../../../data/enums/enums';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Budget} from '../../../data/models/budget.model';
import {BudgetsService} from '../../budget-management/budgets/budgets.service';


@Component({
    selector: 'staff_management-demand',
    templateUrl: './demand.component.html',
    styleUrls: ['./demand.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DemandComponent implements OnInit, OnDestroy {
    demand: Demand;
    pageType: string;
    demandForm: FormGroup;
    currentUser = new TuwindiUtils().getAppUser();
    demandState = DEMAND_STATE;
    demandStates: any[];
    budgets: Budget[];
    budget: Budget;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _demandService
     * @param {FormBuilder} _formBuilder
     * @param _router
     * @param _spinnerService
     * @param _toastr
     * @param _budgetService
     */
    constructor(
        private _demandService: DemandService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _spinnerService: NgxSpinnerService,
        private _toastr: ToastrService,
        private _budgetService: BudgetsService
    ) {
        // Set the default
        this.demand = new Demand();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.demandStates = Object.keys(this.demandState);
        this.getBudgets();
        // Subscribe to update product on changes
        this._demandService.onDemandChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(demand => {

                if (demand) {
                    this.onBudgetSelected(demand?.budget?.id);
                    this.pageType = 'edit';
                    this.demand = new Demand(demand);
                } else {
                    this.pageType = 'new';
                    this.demand = new Demand();
                }

                this.demandForm = this.createDemandForm();
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

    getBudgets() {
        this._budgetService.findAll().subscribe(data => {
            this.budgets = data['response'];
        }, error => console.log(error));
    }

    onBudgetSelected(id: number) {
        this._budgetService.getById(id).subscribe(data => {
            this.budget = data['response'];
        }, error => console.log(error));
    }

    /**
     * Create demand form
     *
     * @returns {FormGroup}
     */
    createDemandForm(): FormGroup {
        return this._formBuilder.group({
            id: new FormControl(this.demand?.id),
            title: new FormControl(this.demand?.title, Validators.required),
            budget: new FormControl(this.demand?.budget?.id, Validators.required),
            demandDate: new FormControl(new Date(this.demand?.demandDate), Validators.required),
            description: new FormControl(this.demand?.description, Validators.required),
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.demand = new Demand();
        this.demand = this.demandForm.getRawValue();
        this.demand.demandState = this.demandStates[0];
        this.demand.createBy = this.currentUser;
        this.demand.budget = this.budget;
        if (!this.demand.id) {
            this._demandService.save(this.demand).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/staff_management/demands');
                    this._spinnerService.hide();
                } else {
                    this._spinnerService.hide();
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._demandService.update(this.demand).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/staff_management/demands');
                    this._spinnerService.hide();
                } else {
                    this._spinnerService.hide();
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
