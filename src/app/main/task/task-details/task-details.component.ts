import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '@fuse/animations';

import {TaskService} from '../task.service';
import {Task} from '../../../data/models/task.model';
import {TASK_PRIORITY, TASK_STATE} from '../../../data/enums/enums';
import {Router} from '@angular/router';
import {EntityListUtils} from '../../../utils/entity.list.utils';
import {TuwindiUtils} from '../../../utils/tuwindi-utils';
import {Employee} from '../../../data/models/employee.model';
import {Project} from '../../../data/models/project.model';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
    selector: 'task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

    tuwindiUtils = new TuwindiUtils();
    entityListUtils = new EntityListUtils();
    currentUser = this.tuwindiUtils.getAppUser();

    task: Task;

    priorities: any[];
    states: any[];

    employees: Employee[];
    projects: Project[];

    filteredEmployees: Employee[];
    filteredProjects: Project[];

    formType: string;
    taskForm: FormGroup;

    stateTask = TASK_STATE;
    priorityTask = TASK_PRIORITY;

    minDate: Date;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TaskService} _taskService
     * @param _router
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _taskService: TaskService,
        private _router: Router,
        private _formBuilder: FormBuilder
    ) {
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

        // Subscribe to update the current task
        this._taskService.onCurrentTaskChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([task, formType]) => {

                if (task && task.id && formType === 'edit') {
                    this.formType = 'edit';
                    this.task = task;
                    this.taskForm = this.createTaskForm();
                    this.minDate = this.taskForm.get('startDate').value;

                    this.taskForm.valueChanges
                        .pipe(
                            takeUntil(this._unsubscribeAll),
                            debounceTime(500),
                            distinctUntilChanged()
                        )
                        .subscribe(data => {
                            this._taskService.updateTask(data);
                        });
                }
                // else if (formType === 'new') {}
            });

        // Subscribe to update on priority change
        this._taskService.onPrioritiesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(priorities => {
                this.priorities = priorities;
            });

        // Subscribe to update on priority change
        this._taskService.onStatesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(states => {
                this.states = states;
            });

        // Subscribe to update on user change
        this._taskService.onEmployeesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(employees => {
                this.employees = employees;
                this.filteredEmployees = this.employees;
            });

        // Subscribe to update on user change
        this._taskService.onProjectsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(projects => {
                this.projects = projects;
                this.filteredProjects = this.projects;
            });

        // Subscribe to update on priority change
        this._taskService.onNewTaskClicked
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.task = new Task({});
                // this.task.id = FuseUtils.generateGUID();
                this.formType = 'new';
                this.taskForm = this.createTaskForm();
                this.minDate = this.taskForm.get('startDate').value;

                this._taskService.onCurrentTaskChanged.next([this.task, 'new']);
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

    /**
     * Create task form
     *
     * @returns {FormGroup}
     */
    createTaskForm(): FormGroup {
        return this._formBuilder.group({
            'id': [this.task.id],
            'title': [this.task.title],
            'description': [this.task.description],
            'startDate': new FormControl({value: this.task.startDate, disabled: true}),
            'endDate': new FormControl({value: this.task.endDate, disabled: true}),
            'state': [this.task.state],
            'priority': [this.task.priority],
            'employee': [this.task.employee],
        });
    }


    /**
     * Toggle Deleted
     *
     * @param event
     */
    toggleDeleted(event): void {
        event.stopPropagation();
        if (this.task && this.task.id && this.formType === 'edit') {
            this._taskService.deleteTask(this.task.id);
        } else {
            this._taskService.onCurrentTaskChanged.next([null, null]);
        }
        this.task = null;
        // this._router.navigateByUrl('/views/tasks');
    }


    togglePriorityOnTask(priority): void {
        this.task.priority = priority;
        if (this.task && this.task.id && this.formType === 'edit') {
            this._taskService.togglePriorityOnTask(priority, this.task);
        }
    }

    toggleStateOnTask(state): void {
        this.task.state = state;
        if (this.task && this.task.id && this.formType === 'edit') {
            this._taskService.toggleStateOnTask(state, this.task);
        }
    }

    toggleEmployeeOnTask(employee): void {
        this.task.employee = employee;
        if (this.task && this.task.id && this.formType === 'edit') {
            this._taskService.toggleEmployeeOnTask(employee, this.task);
        }
    }


    toggleProjectOnTask(project): void {
        this.task.project = project;
        if (this.task && this.task.id && this.formType === 'edit') {
            this._taskService.toggleProjectOnTask(project, this.task);
        }

    }

    toggleOnSearch(event): void {
        event.stopPropagation();
    }

    onListItemFiltering(tag: string, query: any) {
        if (tag === 'employee') {
            this.filteredEmployees = this.entityListUtils.searchUser(query, this.employees);
        } else if (tag === 'customer') {
            this.filteredProjects = this.entityListUtils.searchCustomer(query, this.projects);
        }
    }

    /**
     * Add task
     */
    addTask(): void {

        this.task.id = this.taskForm.get('id').value;
        this.task.title = this.taskForm.get('title').value;
        this.task.description = this.taskForm.get('description').value;
        this.task.startDate = this.taskForm.get('startDate').value;
        this.task.endDate = this.taskForm.get('endDate').value;

        /* if (!this.task.employee) {
             this.task.employee = this.currentUser;
         }*/
        // this.task.state = this.taskForm.get('state').value;
        // this.task.priority = this.taskForm.get('priority').value;

        if (!this.task.id) {
            this._taskService.createTask(this.task);
        } else {
            this._taskService.updateTask(this.task);
        }

        this.task = null;

        this._router.navigateByUrl('/main/tasks');
    }

    addEvent(event?: MatDatepickerInputEvent<Date>) {
        let selectedDate = new Date();
        if (event) {
            selectedDate = new Date(event.value);
            this.minDate = new Date(selectedDate);
        }
    }
}
