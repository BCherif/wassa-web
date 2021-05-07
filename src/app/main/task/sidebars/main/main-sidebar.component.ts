import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {TaskService} from '../../task.service';
import {TASK_PRIORITY, TASK_STATE} from '../../../../data/enums/enums';
import {EntityListUtils} from '../../../../utils/entity.list.utils';
import {TuwindiUtils} from '../../../../utils/tuwindi-utils';
import {Task} from '../../../../data/models/task.model';
import {Employee} from '../../../../data/models/employee.model';
import {Project} from '../../../../data/models/project.model';


@Component({
    selector: 'task-main-sidebar',
    templateUrl: './main-sidebar.component.html',
    styleUrls: ['./main-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TaskMainSidebarComponent implements OnInit, OnDestroy {

    tuwindiUtils = new TuwindiUtils();
    entityListUtils = new EntityListUtils();

    currentUser = this.tuwindiUtils.getAppUser();

    currentTask: Task;

    employees: Employee[];
    selectedEmployee: Employee;
    filteredEmployees: Employee[];

    projects: Project[];
    selectedProject: Project;
    filteredProjects: Project[];

    stateTask = TASK_STATE;
    priorityTask = TASK_PRIORITY;

    states: any[];
    priorities: any[];


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TaskService} _taskService
     * @param {Router} _router
     */
    constructor(
        private _taskService: TaskService,
        private _router: Router
    ) {
        // Set the defaults
        this.employees = [];
        this.projects = [];

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

        this._taskService.onEmployeesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(employees => {
                this.employees = employees;
                this.filteredEmployees = this.employees;
            });


        this._taskService.onSelectedEmployeeChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(employee => {
                this.selectedEmployee = employee;
            });

        this._taskService.onProjectsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(projects => {
                this.projects = projects;
                this.filteredProjects = this.projects;
            });


        this._taskService.onSelectedProjectChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(project => {
                this.selectedProject = project;
            });

        this._taskService.onStatesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(states => {
                this.states = states;
            });

        this._taskService.onPrioritiesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(priorities => {
                this.priorities = priorities;
            });

        this._taskService.onCurrentTaskChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([currentTask, formType]) => {
                if (!currentTask) {
                    this.currentTask = null;
                } else {
                    this.currentTask = currentTask;
                }
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
     * New task
     */
    newTask(): void {
        this._router.navigate(['/main/tasks/all']).then(() => {
            setTimeout(() => {
                this._taskService.onNewTaskClicked.next('');
            });
        });
    }

    toggleEmployeeOnTask(employee): void {
        this.deselectCurrentTask();
        this.selectedEmployee = employee;
        this._taskService.onEmployeeSelected(this.selectedEmployee);
    }

    toggleProjectOnTask(project): void {
        this.deselectCurrentTask();
        this.selectedProject = project;
        this._taskService.onProjectSelected(this.selectedProject);
    }

    deselectCurrentTask(): void {
        this._taskService.onCurrentTaskChanged.next([null, null]);
    }

    toggleOnSearch(event): void {
        event.stopPropagation();
    }

    onListItemFiltering(tag: string, query: any) {
        if (tag === 'employee') {
            this.filteredEmployees = this.entityListUtils.searchUser(query, this.employees);
        } else if (tag === 'project') {
            this.filteredProjects = this.entityListUtils.searchCustomer(query, this.projects);
        }
    }
}
