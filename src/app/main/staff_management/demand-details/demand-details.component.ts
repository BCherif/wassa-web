import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {Demand} from '../../../data/models/demand.model';
import {DemandsService} from '../demands/demands.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ListResponseBody} from '../../../utils/list-response-body';

@Component({
    selector: 'staff_management-demand-details',
    templateUrl: './demand-details.component.html',
    styleUrls: ['./demand-details.component.css']
})
export class DemandDetailsComponent {

    demand: Demand;
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    constructor(
        public matDialogRef: MatDialogRef<DemandDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _demandsService: DemandsService,
        private _matDialog: MatDialog,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        this.demand = _data.demand;
    }

    approve(approveDemand: Demand) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre d\'approuver cette demande';
        this._spinnerService.show();
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._demandsService.approve(approveDemand).subscribe(data => {
                    this._toastr.success(data['message']);
                    this._demandsService.getDemands(this._demandsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Demand>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                }, error => console.log(error));
            }
        });
    }

    validate(validateDemand: Demand) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider cette demande';
        this._spinnerService.show();
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._demandsService.validate(validateDemand).subscribe(data => {
                    this._toastr.success(data['message']);
                    this._demandsService.getDemands(this._demandsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Demand>();
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
        this._demandsService.getDemands(this._demandsService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Demand>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
