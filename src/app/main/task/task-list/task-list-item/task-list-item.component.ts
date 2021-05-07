import {Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TaskService} from '../../task.service';
import {Task} from '../../../../data/models/task.model';
import {TASK_PRIORITY, TASK_STATE} from '../../../../data/enums/enums';

@Component({
    selector: 'task-list-item',
    templateUrl: './task-list-item.component.html',
    styleUrls: ['./task-list-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskListItemComponent implements OnInit, OnDestroy {
    priorities: any[];

    @Input()
    task: Task;

    @HostBinding('class.selected')
    selected: boolean;

    @HostBinding('class.completed')
    completed: boolean;

    @HostBinding('class.move-disabled')
    moveDisabled: boolean;

    stateTask = TASK_STATE;
    priorityTask = TASK_PRIORITY;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TaskService} _taskService
     * @param {ActivatedRoute} _activatedRoute
     */
    constructor(
        private _taskService: TaskService,
        private _activatedRoute: ActivatedRoute
    ) {
        // Disable move if path is not /all
        if (_activatedRoute.snapshot.url[0].path !== 'all') {
            this.moveDisabled = true;
        }

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
        // Set the initial values
        this.task = new Task(this.task);
        // this.completed = this.task.completed;

        // Subscribe to update on selected task change
        this._taskService.onSelectedTasksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTasks => {
                this.selected = false;

                if (selectedTasks.length > 0) {
                    for (const task of selectedTasks) {
                        if (task.id === this.task.id) {
                            this.selected = true;
                            break;
                        }
                    }
                }
            });

        // Subscribe to update on priority change
        this._taskService.onPrioritiesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(priorities => {
                this.priorities = priorities;
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

    /**
     * On selected change
     */
    onSelectedChange(): void {
        this._taskService.toggleSelectedTask(this.task.id);
    }

    /**
     * Toggle Completed
     */
    deleteTask(event): void {

        event.stopPropagation();

        if (this.task && this.task.id) {
            this._taskService.deleteTask(this.task.id);
        }
        this.task = null;
        // this._router.navigateByUrl('/views/tasks');
    }
}
