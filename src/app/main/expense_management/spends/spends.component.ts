import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FuseUtils} from '@fuse/utils';
import {takeUntil} from 'rxjs/internal/operators';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Spend} from '../../../data/models/spend.model';
import {SPEND_STATE} from '../../../data/enums/enums';
import {SpendsService} from './spends.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {SpendDetailsComponent} from '../spend-details/spend-details.component';

@Component({
    selector: 'expense_management-spends',
    templateUrl: './spends.component.html',
    styleUrls: ['./spends.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SpendsComponent implements OnInit {
    totalElements: number;
    spends: Spend[] | null;
    filteredSpends: Spend[] = [];
    spendState = SPEND_STATE;
    spend: Spend;

    displayedColumns = ['label', 'pictures', 'budgetLine', 'amount', 'date', 'state', 'buttons'];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    searchInput: FormControl;

    /**
     * Boolean options
     */
    uploadDialogVisibility = false;
    attachedFilesVisibility = false;
    uploadButtonVisibility = false;
    loading = false;

    /**
     * Upload Options
     */
    file: FormData;
    files: FormData[];
    fileNames = '';

    constructor(
        public _spendsService: SpendsService,
        private _matDialog: MatDialog,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the private defaults
        this.searchInput = new FormControl();
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On job
     */
    ngOnInit(): void {
        this.getAllSpends();
        this.filteredSpends.sort();
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(100),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.filteredSpends = FuseUtils.filterArrayByString(this.spends, searchText);
            });
    }

    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getAllSpends() {
        this._spendsService.getSpends(this._spendsService.pageBody).subscribe(data => {
            this.spends = data['content'];
            this.filteredSpends = this.spends;
            this.totalElements = data['totalElements'];
        }, error => console.log(error));
    }

    nextPage(event: PageEvent) {
        this._spendsService.pageBody.pageNumber = event.pageIndex;
        this._spendsService.pageBody.pageSize = event.pageSize;
        this.getAllSpends();
    }

    showUploadDialog(spend) {
        this.spend = spend;
        this.fileNames = '';
        this.uploadDialogVisibility = true;
    }

    closeUploadDialog() {
        this.uploadDialogVisibility = false;
    }

    /*//////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////  UPLOAD FILES AND SHOWING THEM
  //////////////////////////////////////////////////////////////////////////////////////////////*/
    loadFiles(event) {
        console.log('LoadFiles');
        this.fileNames = '';
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = new FormData();
            for (let i = 0; i < fileList.length; i++) {
                const fichier: File = fileList[i];
                this.file.append('uploadfile', fichier, fichier.name);
                this.fileNames += fichier.name + ';';
            }
        }
    }

    upload() {
        this._spinnerService.show();
        if (this.file) {
            this._spendsService.upload(+this.spend.id, this.file).subscribe(ret => {
                    if (ret['status'] === 'OK') {
                        this.closeUploadDialog();
                        this._toast.success(ret['message']);
                        this.getAllSpends();
                        this._spinnerService.hide();
                    } else {
                        this._toast.error(ret['message']);
                        this.closeUploadDialog();
                        this.getAllSpends();
                        this._spinnerService.hide();
                    }
                },
                error => {
                    this.closeUploadDialog();
                    this.getAllSpends();
                    this._spinnerService.hide();
                });
        }
    }

    endsWith(file, end) {
        return file.toLowerCase().endsWith(end);
    }

    showDetail(spend) {
        const dialogRef = this._matDialog.open(SpendDetailsComponent, {
            width: '700px',
            data: {
                spend: spend
            }
        });
        dialogRef.afterClosed().subscribe(value => {
            this.spends = value?.content;
            this.filteredSpends = this.spends;
            this.totalElements = value?.totalElements;
        });

    }
}

