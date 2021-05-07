import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {TaskService} from './task.service';
import {Task} from '../../data/models/task.model';
import {TASK_PRIORITY, TASK_STATE} from '../../data/enums/enums';


@Component({
    selector     : 'task',
    templateUrl  : './task.component.html',
    styleUrls    : ['./task.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class TaskComponent implements OnInit, OnDestroy {
    hasSelectedTasks: boolean;
    isIndeterminate: boolean;
    states: any[];
    priorities: any[];
    searchInput: FormControl;
    currentTask: Task;

    stateTask = TASK_STATE;
    priorityTask = TASK_PRIORITY;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TaskService} _taskService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _taskService: TaskService
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._taskService.onSelectedTasksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTasks => {

                setTimeout(() => {
                    this.hasSelectedTasks = selectedTasks.length > 0;
                    this.isIndeterminate = (selectedTasks.length !== this._taskService.tasks.length && selectedTasks.length > 0);
                }, 0);
            });

        this._taskService.onStatesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(folders => {
                this.states = this._taskService.states;
            });

        this._taskService.onPrioritiesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(priorities => {
                this.priorities = this._taskService.priorities;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._taskService.onSearchTextChanged.next(searchText);
            });

        this._taskService.onCurrentTaskChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([currentTask, formType]) => {
                if ( !currentTask )
                {
                    this.currentTask = null;
                }
                else
                {
                    this.currentTask = currentTask;
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Deselect current task
     */
    deselectCurrentTask(): void
    {
        this._taskService.onCurrentTaskChanged.next([null, null]);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        this._taskService.toggleSelectAll();
    }

    /**
     * Select tasks
     *
     * @param filterParameter
     * @param filterValue
     */
    selectTasks(filterParameter?, filterValue?): void
    {
        this._taskService.selectTasks(filterParameter, filterValue);
    }

    /**
     * Deselect tasks
     */
    deselectTasks(): void
    {
        this._taskService.deselectTasks();
    }

    /**
     * Toggle priority on selected tasks
     *
     * @param priority
     */
    togglePriorityOnSelectedTasks(priority): void
    {
        this._taskService.togglePriorityOnSelectedTasks(priority);
    }

    /**
     * Toggle state on selected tasks
     *
     * @param state
     */
    toggleStateOnSelectedTasks(state): void
    {
        this._taskService.toggleStateOnSelectedTasks(state);
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
