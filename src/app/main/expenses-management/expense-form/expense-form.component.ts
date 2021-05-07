import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {BudgetLine} from '../../../data/models/budget.ligne.model';
import {Budget} from '../../../data/models/budget.model';
import {Expense} from '../../../data/models/expense.model';
import {Unity} from '../../../data/models/unity.model';
import {BudgetLineService} from '../../../services/budget.line.service';
import {UnitsService} from '../../configuration/units/units.service';
import {Forecast} from '../../../data/models/forecast.model';
import {SearchBody} from '../../../utils/search-body';
import {ForecastService} from '../../../services/forecast.service';
import {ExpenseService} from '../../../services/expense.service';

@Component({
    selector: 'expenses-management-expense-form',
    templateUrl: './expense-form.component.html',
    styleUrls: ['./expense-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ExpenseFormComponent {
    action: string;
    budgetLine: BudgetLine;
    unity: Unity;
    forecast = new Forecast();
    budget: Budget;
    expense: Expense;
    lines: BudgetLine[];
    unities: Unity[];
    expenseForm: FormGroup;
    dialogTitle: string;
    searchBody: SearchBody;
    dateSelected: Date;
    sumExpenses;
    totalLine = 0;
    amountAvailable = 0;
    expenses: Expense[] = [];

    /**
     * Constructor
     *
     * @param {MatDialogRef<ExpenseFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _toast
     * @param _spinnerService
     * @param _budgetLineService
     * @param _unitsService
     * @param _forecastService
     * @param _expenseService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<ExpenseFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _budgetLineService: BudgetLineService,
        private _unitsService: UnitsService,
        private _forecastService: ForecastService,
        private _expenseService: ExpenseService,
        private _router: Router
    ) {
        // Set the defaults
        this.action = _data.action;
        this.expense = new Expense();
        this.searchBody = new SearchBody();
        this.forecast = new Forecast();
        this.expenses = [];

        if (this.action === 'add') {
            this.dialogTitle = 'Ajout d\'une dépense';
            this.budget = _data.budget;
            this.getLinesByBudgetId(this.budget.id);
            this.createExpense();
        } else {
            this.dialogTitle = 'Modification d\'une dépense';
            this.expense = _data.expense;
            this.getLinesByBudgetId(this.expense.budgetLine.budget.id);
            this.onLineSelected(this.expense.budgetLine.id);
            this.onUnitSelected(this.expense.unity.id);
            this.searchBody.date = new Date(this.expense.date);
            this.searchBody.lineId = this.expense.budgetLine.id;
            this.getForecast(this.searchBody);
            this.updateExpense();
        }
        this.getUnities();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * add Expense
     *
     * @returns {FormGroup}
     */
    createExpense() {
        this.expenseForm = this._formBuilder.group({
            id: new FormControl(this.expense.id),
            title: new FormControl(this.expense.title, Validators.required),
            budgetLine: new FormControl(this.expense.budgetLine, Validators.required),
            unity: new FormControl(this.expense.unity, Validators.required),
            quantity: new FormControl(this.expense.quantity, Validators.required),
            unitPrice: new FormControl(this.expense.unitPrice, Validators.required),
            date: new FormControl(this.expense.date, Validators.required),
            amount: new FormControl({value: '', disabled: true}),
            total: new FormControl({value: this.budgetLine ? this.budgetLine?.amount : 0, disabled: true}),
            amountAvailable: new FormControl({value: this.forecast ? this.forecast?.amount : 0, disabled: true})
        });
        this.updateAmounts();
    }

    updateExpense() {
        this.expenseForm = this._formBuilder.group({
            id: new FormControl(this.expense.id),
            title: new FormControl(this.expense.title, Validators.required),
            budgetLine: new FormControl(this.expense.budgetLine?.id, Validators.required),
            unity: new FormControl(this.expense.unity?.id, Validators.required),
            quantity: new FormControl(this.expense.quantity, Validators.required),
            unitPrice: new FormControl(this.expense.unitPrice, Validators.required),
            date: new FormControl(this.expense.date, Validators.required),
            amount: new FormControl({value: this.expense.amount, disabled: true}),
            total: new FormControl({value: this.budgetLine ? this.budgetLine?.amount : 0, disabled: true}),
            amountAvailable: new FormControl({value: this.forecast ? this.forecast?.amount : 0, disabled: true})
        });
        this.updateAmounts();
    }


    getLinesByBudgetId(id: number) {
        this._budgetLineService.getLines(id).subscribe(data => {
            this.lines = data['response'];
        }, error => console.log(error));
    }

    onLineSelected(id: number) {
        this._budgetLineService.getById(id).subscribe(data => {
            this.budgetLine = data['response'];
            this.expenseForm.get('total').setValue(this.budgetLine ? this.budgetLine?.amount : 0);
            this.searchBody.lineId = this.budgetLine.id;
        }, error => console.log(error));
    }

    getUnities() {
        this._unitsService.findAll().subscribe(data => {
            this.unities = data['response'];
        }, error => console.log(error));
    }

    onUnitSelected(id: number) {
        this._unitsService.getById(id).subscribe(data => {
            this.unity = data['response'];
        }, error => console.log(error));
    }

    getForecast(searchBody: SearchBody) {
        this._forecastService.findByDateAndLineId(searchBody).subscribe(data => {
            this.forecast = data['response'];
            if (this.forecast !== undefined) {
                this.getSumExpenses(searchBody.lineId);
                if (this.forecast.amount > this.sumExpenses) {
                    this.amountAvailable = this.forecast.amount - this.sumExpenses;
                    this.expenseForm.get('amountAvailable').setValue(this.forecast ? this.amountAvailable : 0);
                } else {
                    this.expenseForm.get('amountAvailable').setValue(this.forecast ? this.forecast.amount : 0);
                }
            }
        }, error => console.log(error));
    }

    addEvent(event) {
        this.searchBody.date = new Date(event.value);
        this.getForecast(this.searchBody);
    }

    getSumExpenses(id: number) {
        this._expenseService.sumExpenseByLine(id).subscribe(data => {
            this.sumExpenses = data;
        }, error => console.log(error));
    }

    checkQte(value) {
        if (value) {
            let qte = Number.parseInt(value.replace(/ /g, ''));
            let price = this.expenseForm.get('unitPrice').value;
            let amount = qte * price;
            if (amount < this.forecast.amount) {
                this.expenseForm.get('amount').setValue(amount);
            } else {
                this.expenseForm.get('amount').setValue(this.forecast.amount);
                this._toast.warning('Le montant ne peut pas depasser le montant disponible');
            }
        } else {
            this.expenseForm.get('amount').setValue(0);
        }
        this.updateAmounts();
    }

    checkPU(value) {
        if (value) {
            let price = Number.parseInt(value.replace(/ /g, ''));
            let qte = this.expenseForm.get('quantity').value;
            let amount = qte * price;
            if (amount < this.forecast.amount) {
                this.expenseForm.get('amount').setValue(amount);
            } else {
                this.expenseForm.get('amount').setValue(this.forecast.amount);
                this._toast.warning('Le montant ne peut pas depasser le montant disponible');
            }
        } else {
            this.expenseForm.get('amount').setValue(0);
        }
        this.updateAmounts();
    }

    updateAmounts() {
        let amount = this.expenseForm.get('amount').value;
        let newAmountAvailable = this.forecast?.amount - amount;
        this.expenseForm.get('amountAvailable').setValue(newAmountAvailable);
    }

    add() {
        if (this.expenseForm.get('amount').value <= 0) {
            this._toast.error('Le montant est toujours superieur à 0');
            return;
        }
        this.expense = this.expenseForm.getRawValue();
        this.expense.budgetLine = this.budgetLine;
        this.expense.unity = this.unity;
        this.matDialogRef.close(this.expense);
    }

}
