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
import {Activity} from '../../../data/models/activity.model';
import {ActivitiesService} from './activities.service';
import {ACTIVITY_STATE} from '../../../data/enums/enums';
import {ExpenseService} from '../../../services/expense.service';
import {Expense} from '../../../data/models/expense.model';

@Component({
    selector: 'expenses-management-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ActivitiesComponent implements OnInit {
    totalElements: number;
    activities: Activity[] | null;
    filteredActivities: Activity[] = [];
    activityState = ACTIVITY_STATE;
    expenses: Expense[] = [];

    displayedColumns = ['title', 'startDate', 'endDate', 'createBy', 'state', 'buttons'];

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
        private _activitiesService: ActivitiesService,
        private _expenseService: ExpenseService,
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
     * On init
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
        this.getAll();
        this.filteredActivities.sort();
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(100),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.filteredActivities = FuseUtils.filterArrayByString(this.activities, searchText);
            });
    }

    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getAll() {
        this._activitiesService.getActivities(this._activitiesService.pageBody).subscribe(data => {
            this.activities = data['content'];
            this.filteredActivities = this.activities;
            this.totalElements = data['totalElements'];
        }, error => console.log(error));
    }

    nextPage(event: PageEvent) {
        this._activitiesService.pageBody.pageNumber = event.pageIndex;
        this._activitiesService.pageBody.pageSize = event.pageSize;
        this.getAll();
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
