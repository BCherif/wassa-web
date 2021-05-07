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
import {Job} from '../../../data/models/job.model';
import {JobsService} from './jobs.service';
import {JobFormComponent} from '../job-form/job-form.component';

@Component({
    selector: 'configuration-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class JobsComponent implements OnInit {
    totalElements: number;
    jobs: Job[] | null;
    filteredJobs: Job[] = [];

    displayedColumns = ['title', 'role', 'description', 'buttons'];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    searchInput: FormControl;

    constructor(
        private _jobsService: JobsService,
        private _matDialog: MatDialog
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
        /*this.dataSource = new FilesDataSource(this._rolesService, this.paginator, this.sort);

        // console.log(this.dataSource);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });*/
        this.getAllJobs();
        this.filteredJobs.sort();
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(100),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.filteredJobs = FuseUtils.filterArrayByString(this.jobs, searchText);
            });
    }

    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getAllJobs() {
        this._jobsService.getJobs(this._jobsService.pageBody).subscribe(data => {
            this.jobs = data['content'];
            this.filteredJobs = this.jobs;
            this.totalElements = data['totalElements'];
        }, error => console.log(error));
    }

    nextPage(event: PageEvent) {
        this._jobsService.pageBody.pageNumber = event.pageIndex;
        this._jobsService.pageBody.pageSize = event.pageSize;
        this.getAllJobs();
    }

    /**
     * New job
     */
    newJob(): void {
        const dialogRef = this._matDialog.open(JobFormComponent, {
            panelClass: 'job-form-dialog',
            data: {
                action: 'new'
            }
        });
        dialogRef.afterClosed().subscribe(value => {
            this.jobs = value?.content;
            this.filteredJobs = this.jobs;
            this.totalElements = value?.totalElements;
        });
    }


    editJob(job) {
        const dialogRef = this._matDialog.open(JobFormComponent, {
            panelClass: 'job-form-dialog',
            data: {
                action: 'edit',
                job: job
            }
        });
        dialogRef.afterClosed().subscribe(value => {
            if (!value) {
                this.getAllJobs();
            }
            this.jobs = value?.content;
            this.filteredJobs = this.jobs;
            this.totalElements = value?.totalElements;
        });
    }
}

/*export class FilesDataSource extends DataSource<any> {
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /!**
     * Constructor
     *
     * @param {RolesService} _rolesService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     *!/
    constructor(
        private _rolesService: RolesService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._rolesService.roles;
    }

    // Filtered data
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    /!**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     *!/
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this._rolesService.onRolesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._rolesService.roles.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /!**
     * Filter data
     *
     * @param data
     * @returns {any}
     *!/
    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /!**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     *!/
    sortData(data): any[] {
        if (!this._matSort.active || this._matSort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._matSort.active) {
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'description':
                    [propertyA, propertyB] = [a.description, b.description];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /!**
     * Disconnect
     *!/
    disconnect(): void {
    }
}*/
