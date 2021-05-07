import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';

import {fuseAnimations} from '@fuse/animations';

import {takeUntil} from 'rxjs/operators';
import {Task} from '../../../data/models/task.model';
import {TaskService} from '../task.service';

@Component({
    selector     : 'task-list',
    templateUrl  : './task-list.component.html',
    styleUrls    : ['./task-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class TaskListComponent implements OnInit, OnDestroy
{
    tasks: Task[];
    currentTask: Task;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {TaskService} _taskService
     * @param {Location} _location
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _taskService: TaskService,
        private _location: Location
    )
    {
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
        // Subscribe to update tasks on changes
        this._taskService.onTasksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(tasks => {
                this.tasks = tasks;
            });

        // Subscribe to update current task on changes
        this._taskService.onCurrentTaskChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(currentTask => {
                if ( !currentTask )
                {
                    // Set the current task id to null to deselect the current task
                    this.currentTask = null;

                    // Handle the location changes
                    const priorityHandle    = this._activatedRoute.snapshot.params.priorityHandle,
                          filterHandle = this._activatedRoute.snapshot.params.filterHandle;

                    if ( priorityHandle )
                    {
                        this._location.go('main/tasks/priority/' + priorityHandle);
                    }
                    else if ( filterHandle )
                    {
                        this._location.go('main/tasks/filter/' + filterHandle);
                    }
                    else
                    {
                        this._location.go('main/tasks/all');
                    }
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
     * Read task
     *
     * @param taskId
     */
    readTask(taskId): void
    {
        // Set current task
        this._taskService.setCurrentTask(taskId);
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void
    {

    }
}
