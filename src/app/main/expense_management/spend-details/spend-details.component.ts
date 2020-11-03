import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ListResponseBody} from '../../../utils/list-response-body';
import {Spend} from '../../../data/models/spend.model';
import {SpendsService} from '../spends/spends.service';

@Component({
    selector: 'expense_management-demand-details',
    templateUrl: './spend-details.component.html',
    styleUrls: ['./spend-details.component.css']
})
export class SpendDetailsComponent {

    spend: Spend;
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    constructor(
        public matDialogRef: MatDialogRef<SpendDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public _spendsService: SpendsService,
        private _matDialog: MatDialog,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        this.spend = _data.spend;
    }

    validate(spend1: Spend) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider cette dépense';
        this._spinnerService.show();
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._spendsService.validate(spend1).subscribe(data => {
                    this._toastr.success(data['message']);
                    this._spendsService.getSpends(this._spendsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Spend>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                }, error => console.log(error));
            }
        });
    }

    closeDialog() {
        this._spendsService.getSpends(this._spendsService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Spend>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
