import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Budget} from '../../../data/models/budget.model';
import {BudgetService} from './budget.service';
import {Project} from '../../../data/models/project.model';
import {ProjectsService} from '../../configuration/projects/projects.service';
import {Category} from '../../../data/models/category.model';
import {Unity} from '../../../data/models/unity.model';
import {CategoriesService} from '../../configuration/categories/categories.service';
import {UnitsService} from '../../configuration/units/units.service';
import {TYPE_UNITY} from '../../../data/enums/enums';
import {SearchBody} from '../../../utils/search-body';
import {BudgetLigne} from '../../../data/models/budget.ligne.model';
import {SectionBody} from '../../../utils/section-body';
import {BudgetSaveEntity} from '../../../utils/budget-save-entity';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

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
    categories: Category[];
    unities1: Unity[];
    unities2: Unity[];
    pageType: string;
    budgetForm: FormGroup;
    types: any[];
    type = TYPE_UNITY;
    searchBody = new SearchBody();
    myFormValueChanges$;
    budgetLines: BudgetLigne[];
    budgetLine = new BudgetLigne();
    sections: any[];
    category: Category;
    unity1: Unity;
    unity2: Unity;
    project: Project;

    sectionBody = new SectionBody();
    budgetSaveEntity = new BudgetSaveEntity();

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _budgetService
     * @param _projectsService
     * @param _categoriesService
     * @param _unitsService
     * @param _toast
     * @param _router
     * @param _spinnerService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _budgetService: BudgetService,
        private _projectsService: ProjectsService,
        private _categoriesService: CategoriesService,
        private _unitsService: UnitsService,
        private _toast: ToastrService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService,
        private _formBuilder: FormBuilder
    ) {
        // Set the default
        this.budget = new Budget();

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
        this.types = Object.keys(this.type);
        this.sections = [];
        this.budgetLines = [];
        this.getAllProjects();
        this.getAllUnities1();
        this.getAllUnities2();
        this.getAllCategories();
        this.createBudgetForm();
        // Subscribe to update product on changes
        this._budgetService.onBudgetChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(budget => {

                if (budget) {
                    this.budget = new Budget(budget);
                    this.pageType = 'edit';
                } else {
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
            title: new FormControl(this.budget?.title, Validators.required),
            project: new FormControl(this.budget?.project, Validators.required),
            sections: this._formBuilder.array([
                this.initSection()
            ])
        });
    }

    /**
     * Init section
     */

    initSection() {
        return new FormGroup({
            name: new FormControl(''),
            lines: new FormArray([
                this.intLigne()
            ])
        });
    }

    /**
     * Create form ligne
     */
    private intLigne() {
        const numberPatern = '^[0-9.,]+$';
        return this._formBuilder.group({
            title: ['', Validators.required],
            category: [this.category, Validators.required],
            unity1: [this.unity1, Validators.required],
            quantity1: [1, [Validators.required, Validators.pattern(numberPatern)]],
            unity2: [this.unity2, Validators.required],
            quantity2: [1, [Validators.required, Validators.pattern(numberPatern)]],
            unitPrice: ['', [Validators.required, Validators.pattern(numberPatern)]],
            total: [''],
        });
    }

    /**
     * Add new section row into form
     */
    addSection() {
        const control = <FormArray> this.budgetForm.controls['sections'];
        control.push(this.initSection());
    }

    /**
     * Add new line row into form
     */
    addLine(j: number) {
        const control = <FormArray> this.budgetForm.get('sections')['controls'][j].get('lines');
        control.push(this.intLigne());
    }

    /**
     * Remove section
     */
    removeSection(i) {
        const control = <FormArray> this.budgetForm.controls['sections'];
        control.removeAt(i);
    }

    /**
     * Remove ligne row from form on click delete button
     */
    removeLigne(i, j) {
        const control = <FormArray> this.budgetForm.get('sections')['controls'][i].get('lines');
        control.removeAt(j);
    }

    /**
     * This is one of the way how clear units fields.
     */
    clearAllLignes() {
        const control = <FormArray> this.budgetForm.controls['sections'];
        while (control.length) {
            control.removeAt(control.length - 1);
        }
        control.clearValidators();
        control.push(this.initSection());
    }

    getSections(form) {
        //console.log(form.get('sections').controls);
        return form.controls.sections.controls;
    }

    getLignes(form) {
        //console.log(form.controls.lines.controls);
        return form.controls.lines.controls;
    }

    getAllProjects() {
        this._projectsService.findAll().subscribe(data => {
            this.projects = data['response'];
        }, error => console.log(error));
    }

    getAllCategories() {
        this._categoriesService.findAll().subscribe(data => {
            this.categories = data['response'];
        }, error => console.log(error));
    }

    getAllUnities1() {
        this.searchBody.typeUnity = this.types[0];
        this._unitsService.getAllByType(this.searchBody).subscribe(data => {
            this.unities1 = data['response'];
        }, error => console.log(error));
    }

    getAllUnities2() {
        this.searchBody.typeUnity = this.types[1];
        this._unitsService.getAllByType(this.searchBody).subscribe(data => {
            this.unities2 = data['response'];
        }, error => console.log(error));
    }

    calculateSubtotal(i) {
        // initialize stream on lines
        this.myFormValueChanges$ = this.budgetForm.get('sections')['controls'][i].get('lines').valueChanges;
        // subscribe to the stream so listen to changes on lines
        this.myFormValueChanges$.subscribe(lines => {
            this.updateTotalLinePrice(i, lines);
            this.getSubTotal(i);
        });

    }

    getSubTotal(i): number {
        const control = <FormArray> this.budgetForm.get('sections')['controls'][i].get('lines');
        let lines = control.value;
        return lines
            .map(value => value.total)
            .reduce((sum, current) => +sum + +current, 0);
    }

    /**
     * Update prices as soon as something changed on lines group
     */
    private updateTotalLinePrice(i: number, lines: any) {
        // get our sections group controll
        const control = <FormArray> this.budgetForm.get('sections')['controls'][i].get('lines');
        for (let l in lines) {
            let totalUnitPrice = (lines[l].quantity1 * lines[l].quantity2 * lines[l].unitPrice);
            // update total sum field on line and do not emit event myFormValueChanges$ in this case on lines
            control.at(+l).get('total').setValue(totalUnitPrice, {onlySelf: false, emitEvent: false});
        }
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
        this.budget.title = this.budgetForm.get('title').value;
        this.budget.project = this.project;
        this.budgetSaveEntity.budget = this.budget;
        this.budgetSaveEntity.sections = this.budgetForm.get('sections').value;
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
    }
}
