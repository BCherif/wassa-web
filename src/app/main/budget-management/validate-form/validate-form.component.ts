import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {Budget} from '../../../data/models/budget.model';
import {ProjectsService} from '../../configuration/projects/projects.service';
import {Project} from '../../../data/models/project.model';
import {BudgetService} from '../budget/budget.service';
import {LineUpdateEntity} from '../../../utils/line.update.entity';
import {BudgetsService} from '../budgets/budgets.service';

@Component({
    selector: 'budget-management-validate-form',
    templateUrl: './validate-form.component.html',
    styleUrls: ['./validate-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ValidateFormComponent {
    budget: Budget;
    budgetLines: LineUpdateEntity[];
    projects: Project[];
    budgetForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ValidateFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _budgetService
     * @param _projectsService
     * @param _toast
     * @param _spinnerService
     * @param _budgetsService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<ValidateFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _budgetService: BudgetService,
        private _projectsService: ProjectsService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _budgetsService: BudgetsService,
        private _router: Router
    ) {
        this.getAllProjects();
        // Set the defaults
        this.dialogTitle = 'Formulaire de validation d\'un budget';
        this.budget = _data.budget;
        if (this.budget) {
            this._budgetService.getLinesByBudgetId(this.budget.id).subscribe(data => {
                if (data['status'] === 'OK') {
                    this.budgetLines = data['response'];
                    this.validateBudgetForm();
                }
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAllProjects() {
        this._projectsService.findAll().subscribe(data => {
            this.projects = data['response'];
        }, error => console.log(error));
    }

    /**
     * validate budget form
     *
     * @returns {FormGroup}
     */
    validateBudgetForm() {
        this.budgetForm = this._formBuilder.group({
            id: new FormControl({value: this.budget.id, disabled: true}),
            title: new FormControl({value: this.budget.title, disabled: true}),
            project: new FormControl({value: this.budget.project.id, disabled: true}),
            startDate: new FormControl({value: this.budget.startDate, disabled: true}),
            endDate: new FormControl({value: this.budget.endDate, disabled: true}),
            lines: new FormArray(this.budgetLines.map(item => new FormGroup({
                id: new FormControl({value: item.id, disabled: true}),
                title: new FormControl({value: item.title, disabled: true}),
                code: new FormControl({value: item.code, disabled: true}),
                amount: new FormControl({value: item.amount, disabled: true})
            })))
        });
    }

    getAmountSum(): number {
        const control = <FormArray> this.budgetForm.controls['lines'];
        let subLines = control.value;
        return subLines
            .map(value => value.amount)
            .reduce((sum, current) => +sum + +current, 0);
    }

    validate() {
        this._budgetService.validate(this.budget).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toast.success(data['message']);
                const budgetIndex = this._budgetsService.budgets.indexOf(this.budget);
                this._budgetsService.budgets.splice(budgetIndex, 1, data['response']);
                this._budgetsService.onBudgetsChanged.next(this._budgetsService.budgets);
                this._router.navigateByUrl('/main/budget-management/budgets');
                this.matDialogRef.close();
                this._spinnerService.hide();
            } else {
                this._toast.error(data['message']);
                this.matDialogRef.close();
                this._spinnerService.hide();
            }
        });
    }

}
