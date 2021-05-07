import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {BudgetLine} from '../../../data/models/budget.ligne.model';
import {Category} from '../../../data/models/category.model';
import {SubLineSaveEntity} from '../../../utils/sub-line-save-entity';
import {CategoriesService} from '../../configuration/categories/categories.service';
import {SubLineService} from '../../../services/sub.line.service';

@Component({
    selector: 'budget-management-add-sub-line-form',
    templateUrl: './add-sub-line-form.component.html',
    styleUrls: ['./add-sub-line-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AddSubLineFormComponent {
    budgetLine: BudgetLine;
    category: Category;
    categories: Category[];
    subLineForm: FormGroup;
    dialogTitle: string;
    subLineSaveEntity: SubLineSaveEntity;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddSubLineFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _subLineService
     * @param _toast
     * @param _spinnerService
     * @param _categoriesService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<AddSubLineFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _subLineService: SubLineService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _categoriesService: CategoriesService,
        private _router: Router
    ) {
        // Set the defaults
        this.subLineSaveEntity = new SubLineSaveEntity();
        this.dialogTitle = 'Formulaire d\' ajout d\'un détail';
        this.budgetLine = _data.budgetLine;
        this.addSubLineForm();
        this.getCategories();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * add subLine form
     *
     * @returns {FormGroup}
     */
    addSubLineForm() {
        this.subLineForm = this._formBuilder.group({
            title: new FormControl({value: this.budgetLine.title, disabled: true}),
            total: new FormControl({value: this.budgetLine ? this.budgetLine.amount : 0, disabled: true}),
            subLines: this._formBuilder.array([
                this.initSubLine()
            ])
        });
        this.updateAmounts();
    }

    /**
     * Init subLine
     */

    initSubLine() {
        return new FormGroup({
            title: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
            line: new FormControl(this.budgetLine),
            category: new FormControl(this.category)
        });
    }

    /**
     * Add new line row into form
     */
    addSubLine() {
        const control = <FormArray> this.subLineForm.controls['subLines'];
        control.push(this.initSubLine());
    }

    /**
     * Remove Line
     */
    removeLine(i) {
        const control = <FormArray> this.subLineForm.controls['subLines'];
        control.removeAt(i);
    }

    /**
     * This is one of the way how clear units fields.
     */
    clearAllLines() {
        const control = <FormArray> this.subLineForm.controls['subLines'];
        while (control.length) {
            control.removeAt(control.length - 1);
        }
        control.clearValidators();
        control.push(this.initSubLine());
    }

    getAmountSum(): number {
        const control = <FormArray> this.subLineForm.controls['subLines'];
        let subLines = control.value;
        return subLines
            .map(value => value.amount)
            .reduce((sum, current) => +sum + +current, 0);
    }

    checkAmount(value, i) {
        if (value) {
            let amount = Number.parseInt(value.replace(/ /g, ''));
            let newAmountStay = this.budgetLine.amount - this.getAmountSum();
            if (newAmountStay >= 0) {
                this.subLineForm.get('subLines')['controls'][i].get('amount').setValue(amount);
            } else {
                this.subLineForm.get('subLines')['controls'][i].get('amount').setValue(newAmountStay);
                this._toast.warning('Le montant ne peut pas depasser le reste à financer');
            }
        } else {
            this.subLineForm.get('subLines')['controls'][i].get('amount').setValue(0);
        }
        this.updateAmounts();
    }

    updateAmounts() {
        let newAmountStay = this.budgetLine.amount - this.getAmountSum();
        this.subLineForm.get('total').setValue(newAmountStay);
    }

    getCategories() {
        this._categoriesService.findAll().subscribe(data => {
            this.categories = data['response'];
        }, error => console.log(error));
    }

    onCategorySelected(id: number) {
        this._categoriesService.getById(id).subscribe(data => {
            this.category = data['response'];
        }, error => console.log(error));
    }

    save() {
        this._spinnerService.show();
        this.subLineSaveEntity.subLines = this.subLineForm.get('subLines').value;
        this.subLineSaveEntity.budgetLine = this.budgetLine;
        this._subLineService.save(this.subLineSaveEntity).subscribe(data => {
            if (data['status'] === 'OK') {
                let line = data['message'];
                this._toast.success(data['message']);
                this._router.navigateByUrl('/main/budget-management/budget-details/details/' + line?.budget?.id);
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
