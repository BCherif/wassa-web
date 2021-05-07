import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {BudgetLine} from '../../../data/models/budget.ligne.model';
import {ForecastSaveEntity} from '../../../utils/forecast-save-entity';
import {ForecastService} from '../../../services/forecast.service';

@Component({
    selector: 'budget-management-add-forecast-form',
    templateUrl: './add-forecast-form.component.html',
    styleUrls: ['./add-forecast-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AddForecastFormComponent {
    budgetLine: BudgetLine;
    forecastForm: FormGroup;
    dialogTitle: string;
    forecastSaveEntity: ForecastSaveEntity;
    minDate: Date;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AddForecastFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _forecastService
     * @param _toast
     * @param _spinnerService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<AddForecastFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _forecastService: ForecastService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _router: Router
    ) {
        // Set the defaults
        this.forecastSaveEntity = new ForecastSaveEntity();
        this.dialogTitle = 'Formulaire d\' ajout d\'une prévision';
        this.budgetLine = _data.budgetLine;
        this.addForecastForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * add forecast form
     *
     * @returns {FormGroup}
     */
    addForecastForm() {
        this.forecastForm = this._formBuilder.group({
            title: new FormControl({value: this.budgetLine.title, disabled: true}),
            total: new FormControl({value: this.budgetLine ? this.budgetLine.amount : 0, disabled: true}),
            forecasts: this._formBuilder.array([
                this.initForecast()
            ])
        });
        this.updateAmounts();
    }

    /**
     * Init forecast
     */

    initForecast() {
        return new FormGroup({
            amount: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required),
            line: new FormControl(this.budgetLine)
        });
    }

    /**
     * Add new line row into form
     */
    addLine() {
        const control = <FormArray> this.forecastForm.controls['forecasts'];
        control.push(this.initForecast());
    }

    /**
     * Remove Line
     */
    removeLine(i) {
        const control = <FormArray> this.forecastForm.controls['forecasts'];
        control.removeAt(i);
    }

    /**
     * This is one of the way how clear units fields.
     */
    clearAllLines() {
        const control = <FormArray> this.forecastForm.controls['forecasts'];
        while (control.length) {
            control.removeAt(control.length - 1);
        }
        control.clearValidators();
        control.push(this.initForecast());
    }

    checkAmount(value, i) {
        if (value) {
            let amount = Number.parseInt(value.replace(/ /g, ''));
            let newAmountStay = this.budgetLine.amount - this.getAmountSum();
            if (newAmountStay >= 0) {
                this.forecastForm.get('forecasts')['controls'][i].get('amount').setValue(amount);
            } else {
                this.forecastForm.get('forecasts')['controls'][i].get('amount').setValue(newAmountStay);
                this._toast.warning('Le montant ne peut pas depasser le reste à prévisionner');
            }
        } else {
            this.forecastForm.get('forecasts')['controls'][i].get('amount').setValue(0);
        }
        this.updateAmounts();
    }

    updateAmounts() {
        let newAmountStay = this.budgetLine.amount - this.getAmountSum();
        this.forecastForm.get('total').setValue(newAmountStay);
    }

    getAmountSum(): number {
        const control = <FormArray> this.forecastForm.controls['forecasts'];
        let subLines = control.value;
        return subLines
            .map(value => value.amount)
            .reduce((sum, current) => +sum + +current, 0);
    }

    addEvent(event) {
        let selectedDate = new Date();
        if (event) {
            selectedDate = new Date(event.value);
            this.minDate = new Date(selectedDate);
        }
    }


    save() {
        this._spinnerService.show();
        this.forecastSaveEntity.forecasts = this.forecastForm.get('forecasts').value;
        this.forecastSaveEntity.budgetLine = this.budgetLine;
        this._forecastService.save(this.forecastSaveEntity).subscribe(data => {
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
