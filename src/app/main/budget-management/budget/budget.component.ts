import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Budget} from '../../../data/models/budget.model';
import {BudgetService} from './budget.service';
import {BudgetSaveEntity} from '../../../utils/budget-save-entity';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Project} from '../../../data/models/project.model';
import {ProjectsService} from '../../configuration/projects/projects.service';
import {LineUpdateEntity} from '../../../utils/line.update.entity';

@Component({
    selector: 'budget-management-budget',
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BudgetComponent implements OnInit, OnDestroy {
    budget: Budget;
    projects: Project[];
    pageType: string;
    budgetForm: FormGroup;
    budgetSaveEntity: BudgetSaveEntity;
    minDate: Date;
    project: Project;
    lines: LineUpdateEntity[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _budgetService
     * @param _projectsService
     * @param _toast
     * @param _router
     * @param _spinnerService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _budgetService: BudgetService,
        private _projectsService: ProjectsService,
        private _toast: ToastrService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService,
        private _formBuilder: FormBuilder
    ) {
        // Set the default
        this.budgetSaveEntity = new BudgetSaveEntity();

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
        this.getAllProjects();
        // Subscribe to update product on changes
        this._budgetService.onBudgetChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(budget => {
                if (budget) {
                    this.pageType = 'edit';
                    this._budgetService.getLinesByBudgetId(budget.id).subscribe(data => {
                        if (data['status'] === 'OK') {
                            this.lines = data['response'];
                            this.budget = new Budget(budget);
                            this.onProjectSelected(this.budget.project.id);
                            this.updateBudgetForm();
                        }
                    });
                } else {
                    this.createBudgetForm();
                    this.pageType = 'new';
                    this.budget = new Budget();
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
     * Create budget form
     *
     * @returns {FormGroup}
     */
    createBudgetForm() {
        this.budgetForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            project: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required),
            lines: this._formBuilder.array([
                this.initLine()
            ])
        });
    }

    updateBudgetForm() {
        this.budgetForm = this._formBuilder.group({
            id: new FormControl(this.budget.id),
            title: new FormControl(this.budget.title, Validators.required),
            project: new FormControl(this.budget.project.id, Validators.required),
            startDate: new FormControl(this.budget.startDate, Validators.required),
            endDate: new FormControl(this.budget.endDate, Validators.required),
            lines: new FormArray(this.lines.map(item => new FormGroup({
                id: new FormControl(item.id),
                title: new FormControl(item.title, Validators.required),
                code: new FormControl(item.code),
                amount: new FormControl(item.amount, Validators.required)
            })))
        });
    }

    /**
     * Init line
     */

    initLine() {
        return new FormGroup({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            code: new FormControl(''),
            amount: new FormControl('', Validators.required)
        });
    }

    /**
     * Add new line row into form
     */
    addLine() {
        const control = <FormArray> this.budgetForm.controls['lines'];
        control.push(this.initLine());
    }

    /**
     * Remove Line
     */
    removeLine(i) {
        const control = <FormArray> this.budgetForm.controls['lines'];
        control.removeAt(i);
    }

    addEvent(event) {
        let selectedDate = new Date();
        if (event) {
            selectedDate = new Date(event.value);
            this.minDate = new Date(selectedDate);
        }
    }


    /**
     * This is one of the way how clear units fields.
     */
    clearAllLines() {
        const control = <FormArray> this.budgetForm.controls['lines'];
        while (control.length) {
            control.removeAt(control.length - 1);
        }
        control.clearValidators();
        control.push(this.initLine());
    }

    getAllProjects() {
        this._projectsService.findAll().subscribe(data => {
            this.projects = data['response'];
        }, error => console.log(error));
    }

    getAmountSum(): number {
        const control = <FormArray> this.budgetForm.controls['lines'];
        let lines = control.value;
        return lines
            .map(value => value.amount)
            .reduce((sum, current) => +sum + +current, 0);
    }

    onProjectSelected(id: number) {
        this._projectsService.getById(id).subscribe(data => {
            this.project = data['response'];
        }, error => console.log(error));
    }

    save() {
        this._spinnerService.show();
        this.budget = new Budget();
        this.budgetSaveEntity = new BudgetSaveEntity();
        this.budget.id = this.budgetForm.get('id').value;
        this.budget.title = this.budgetForm.get('title').value;
        this.budget.startDate = this.budgetForm.get('startDate').value;
        this.budget.endDate = this.budgetForm.get('endDate').value;
        this.budget.project = this.project;
        this.budgetSaveEntity.budget = this.budget;
        this.budgetSaveEntity.lines = this.budgetForm.get('lines').value;
        if (!this.budget.id) {
            this._budgetService.save(this.budgetSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._router.navigateByUrl('/main/budget-management/budgets');
                    this._spinnerService.hide();
                } else {
                    this._toast.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        } else {
            this.budget.updateDate = new Date();
            this._budgetService.update(this.budget.id, this.budgetSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._router.navigateByUrl('/main/budget-management/budgets');
                    this._spinnerService.hide();
                } else {
                    this._toast.error(data['message']);
                    this._spinnerService.hide();
                }
            });

        }
    }
}
