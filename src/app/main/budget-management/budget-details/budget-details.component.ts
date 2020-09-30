import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Budget} from '../../../data/models/budget.model';
import {BudgetLigne} from '../../../data/models/budget.ligne.model';
import {BudgetDetailsService} from './budget-details.service';
import {BudgetLineService} from '../../../services/budget.line.service';
import {MatDialog} from '@angular/material/dialog';
import {LinePartnerComponent} from '../line-partner/line-partner.component';
import {LINE_STATE, METHOD_OF_PAYMENT} from '../../../data/enums/enums';
import {LinePartnerService} from '../../../services/line.partner.service';
import {LinePartner} from '../../../data/models/line.partner';
import {PageBody} from '../../../utils/page-body';
import {PageEvent} from '@angular/material/paginator';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ExcelService} from '../../../services/excel.service';
import * as FileSaver from 'file-saver';


@Component({
    selector: 'budget-management-budget-details',
    templateUrl: './budget-details.component.html',
    styleUrls: ['./budget-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BudgetDetailsComponent implements OnInit, OnDestroy {
    budget: Budget;
    budgetLines: BudgetLigne[] = [];
    linePartners: LinePartner[] = [];
    lineState = LINE_STATE;
    methodOfPaymentEnum = METHOD_OF_PAYMENT;
    totalElements: number;
    totalLineElements: number;
    pageBody: PageBody;

    dialogRef: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _budgetDetailsService
     * @param _budgetLineService
     * @param _linePartnerService
     * @param {FormBuilder} _formBuilder
     * @param _spinnerService
     * @param _toast
     * @param _router
     * @param excelService
     * @param _matDialog
     */
    constructor(
        private _budgetDetailsService: BudgetDetailsService,
        private _budgetLineService: BudgetLineService,
        private _linePartnerService: LinePartnerService,
        private _formBuilder: FormBuilder,
        private _spinnerService: NgxSpinnerService,
        private _toast: ToastrService,
        private _router: Router,
        private excelService: ExcelService,
        public _matDialog: MatDialog
    ) {
        // Set the defaults
        this.budget = new Budget();
        this.pageBody = new PageBody();
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
        // Subscribe to update budget on changes
        this._budgetDetailsService.onBudgetChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(budget => {
                this.budget = new Budget(budget);
                this.pageBody.budgetId = this.budget.id;
                this.findAllByBudgetId(this.pageBody);
                this.findAllElementByBudget(this.pageBody);
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

    findAllByBudgetId(pageBody: PageBody) {
        this._budgetLineService.findAllByBudgetId(pageBody).subscribe(data => {
            this.budgetLines = data['content'];
            this.totalLineElements = data['totalElements'];
        }, error => console.log(error));
    }

    /* findAllElementByBudget(id: number) {
         return this._linePartnerService.findAllElementByBudget(id).subscribe(data => {
             this.linePartners = data['response'];
         }, error => console.log(error));
     }*/

    findAllElementByBudget(pageBody: PageBody) {
        this._linePartnerService.findAllElementByBudget(pageBody).subscribe(data => {
            this.linePartners = data['content'];
            this.totalElements = data['totalElements'];
        }, error => console.log(error));
    }

    nextPage(event: PageEvent) {
        this.pageBody.pageNumber = event.pageIndex;
        this.pageBody.pageSize = event.pageSize;
        this.findAllElementByBudget(this.pageBody);
    }

    nextLinePage(event: PageEvent) {
        this.pageBody.pageNumber = event.pageIndex;
        this.pageBody.pageSize = event.pageSize;
        this.findAllByBudgetId(this.pageBody);
    }


    issueFinancing(action?: string, budgetLigne?: BudgetLigne) {
        this.dialogRef = this._matDialog.open(LinePartnerComponent, {
            panelClass: 'line-partner-form-dialog',
            data: {
                budgetLigne: budgetLigne,
                action: action
            }
        });
    }

    /*
        downloadCsv(id: number) {
            this._budgetLineService.downloadCsv(id).subscribe(value => {
                this.excelService.saveAsExcelFile(value, 'FormatStandard');
                this._toast.success('Exporter avec succès !!!');
                this._router.navigateByUrl('/main/budget-management/budgets');
                this._spinnerService.hide();
            }, error => {
                this._toast.error('Une erreur est survenue !!!');
                this._spinnerService.hide();
            });
        }*/

    exportBudgetExcel(id: number) {
        this._budgetLineService.downloadFile(id);
        // this._budgetLineService.downloadCsv(id).subscribe(value => {
        //     const blob = new Blob([value], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        //     FileSaver.saveAs(blob, 'FormatStandard.xlsx');
        //     /*if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //         window.navigator.msSaveOrOpenBlob(blob);
        //         return;
        //     }
        //     const data = window.URL.createObjectURL(blob);
        //     const link = document.createElement('a');
        //     link.href = data;
        //     link.download = 'FormatStandard.xlsx';
        //     link.dispatchEvent(new MouseEvent('click', {bubbles: true, view: window}));
        //
        //     setTimeout(function() {
        //         window.URL.revokeObjectURL(data);
        //         link.remove();
        //     }, 100);*/
        // });
    }
}
