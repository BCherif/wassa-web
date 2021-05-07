import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {FuseUtils} from '@fuse/utils';
import {TASK_PRIORITY, TASK_STATE} from '../../data/enums/enums';
import {environment} from '../../../environments/environment';
import {Task} from '../../data/models/task.model';
import {ToastrService} from 'ngx-toastr';
import {TuwindiUtils} from '../../utils/tuwindi-utils';
import {Employee} from '../../data/models/employee.model';
import {Project} from '../../data/models/project.model';
import {EmployeesService} from '../staff-management/employees/employees.service';
import {ProjectsService} from '../configuration/projects/projects.service';
import {SearchTaskBody} from '../../utils/search.task.body';


@Injectable({
    providedIn: 'root'
})
export class TaskService implements Resolve<any> {

    tuwindiUtils = new TuwindiUtils();
    //currentUser = this.tuwindiUtils.getAppUser();

    readonly serviceURL: string;
    readonly httpOptions: any;

    tasks: Task[];
    filteredTasks: Task[];
    selectedTasks: Task[];
    currentTask: Task;

    employees: Employee[];
    selectedEmployee: Employee;

    projects: Project[];
    selectedProject: Project;

    searchText: string;

    states = [];
    priorities = [];

    routeParams: any;

    onTasksChanged: BehaviorSubject<any>;
    onSelectedTasksChanged: BehaviorSubject<any>;
    onCurrentTaskChanged: BehaviorSubject<any>;

    onStatesChanged: BehaviorSubject<any>;
    onPrioritiesChanged: BehaviorSubject<any>;

    onSearchTextChanged: BehaviorSubject<any>;
    onNewTaskClicked: Subject<any>;

    onSelectedEmployeeChanged: BehaviorSubject<any>;
    onEmployeesChanged: BehaviorSubject<any>;

    onSelectedProjectChanged: BehaviorSubject<any>;
    onProjectsChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {Location} _location
     * @param _employeesService
     * @param _projectsService
     * @param _toastr
     */
    constructor(
        private _httpClient: HttpClient,
        private _location: Location,
        private _employeesService: EmployeesService,
        private _projectsService: ProjectsService,
        private _toastr: ToastrService
    ) {
        this.serviceURL = environment.serviceUrl + '/tasks';
        this.httpOptions = this.tuwindiUtils.httpHeaders();

        // Set the defaults
        this.filteredTasks = [];
        this.selectedTasks = [];
        this.searchText = '';
        this.onTasksChanged = new BehaviorSubject([]);
        this.onSelectedTasksChanged = new BehaviorSubject([]);
        this.onCurrentTaskChanged = new BehaviorSubject([]);
        this.onStatesChanged = new BehaviorSubject([]);
        this.onPrioritiesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new BehaviorSubject('');
        this.onNewTaskClicked = new Subject();
        this.onSelectedEmployeeChanged = new BehaviorSubject([]);
        this.onEmployeesChanged = new BehaviorSubject([]);
        this.onSelectedProjectChanged = new BehaviorSubject([]);
        this.onProjectsChanged = new BehaviorSubject([]);
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getStates(),
                this.getPriorities(),
                this.getEmployees(),
                this.getProjects(),
                this.getTasks()
            ]).then(
                () => {
                    if (this.routeParams.taskId) {
                        this.setCurrentTask(this.routeParams.taskId);
                    } else {
                        this.setCurrentTask(null);
                    }

                    this.onSearchTextChanged.subscribe(searchText => {
                        if (searchText !== '') {
                            this.searchText = searchText;
                            // this.getTasks();
                            this.tasks = FuseUtils.filterArrayByString(this.filteredTasks, this.searchText);
                            this.onTasksChanged.next(this.tasks);
                        } else {
                            this.searchText = searchText;
                            // this.getTasks();
                            this.tasks = FuseUtils.filterArrayByString(this.filteredTasks, this.searchText);
                            this.onTasksChanged.next(this.tasks);
                        }
                    });
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get all states
     *
     * @returns {Promise<any>}
     */
    getStates(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.states = Object.keys(TASK_STATE);
            this.onStatesChanged.next(this.states);
            resolve(this.states);
        });
    }

    /**
     * Get all priorities
     *
     * @returns {Promise<any>}
     */
    getPriorities(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.priorities = Object.keys(TASK_PRIORITY);
            this.onPrioritiesChanged.next(this.priorities);
            resolve(this.priorities);
        });
    }

    /**
     * Get tasks
     *
     * @returns {Promise<Task[]>}
     */
    getTasks(): Promise<Task[]> {

        if (this.routeParams.priorityHandle) {
            return this.getTasksByPriority(this.routeParams.priorityHandle);
        }

        if (this.routeParams.stateHandle) {
            return this.getTasksByState(this.routeParams.stateHandle);
        }

        return this.getTasksByParams(this.routeParams);
    }

    getEmployees(): any {
        return new Promise((resolve, reject) => {

            this._employeesService.findAll()
                .subscribe(ret => {
                    if (ret['status'] === 'OK') {
                        this.employees = ret['response'];
                        this.onEmployeesChanged.next(this.employees);
                    }
                    resolve(this.employees);
                });
        });
    }

    getProjects(): any {
        return new Promise((resolve, reject) => {

            this._projectsService.findAll()
                .subscribe(ret => {
                    if (ret['status'] === 'OK') {
                        this.projects = ret['response'];
                        this.onProjectsChanged.next(this.projects);
                    }
                    resolve(this.projects);
                });
        });
    }

    /**
     * Get tasks by params
     *
     * @param handle
     * @returns {Promise<Task[]>}
     */
    getTasksByParams(handle): Promise<Task[]> {
        return new Promise((resolve, reject) => {

            let searchTaskBody = new SearchTaskBody();
            if (this.selectedEmployee) {
                searchTaskBody.employeeId = this.selectedEmployee.id;
            }
            if (this.selectedProject) {
                searchTaskBody.projectId = this.selectedProject.id;
            }

            this._httpClient.post(this.serviceURL + '/find', searchTaskBody, this.httpOptions)
                .subscribe(ret => {

                    this.filteredTasks = ret['response'].map(task => {
                        return new Task(task);
                    });

                    /*this.tasks = ret['response'].map(task => {
                        return new Task(task);
                    });*/

                    this.tasks = FuseUtils.filterArrayByString(this.filteredTasks, this.searchText);

                    this.onTasksChanged.next(this.tasks);

                    resolve(this.tasks);
                });
        });
    }

    /**
     * Get tasks by state
     *
     * @param handle
     * @returns {Promise<Task[]>}
     */
    getTasksByState(handle): Promise<Task[]> {

        return new Promise((resolve, reject) => {
            let searchTaskBody = new SearchTaskBody();
            searchTaskBody.taskState = handle;
            if (this.selectedEmployee) {
                searchTaskBody.employeeId = this.selectedEmployee.id;
            }
            if (this.selectedProject) {
                searchTaskBody.projectId = this.selectedProject.id;
            }

            this._httpClient.post(this.serviceURL + '/find', searchTaskBody, this.httpOptions)
                .subscribe((ret: any) => {

                    this.filteredTasks = ret['response'].map(task => {
                        return new Task(task);
                    });

                    this.tasks = FuseUtils.filterArrayByString(this.filteredTasks, this.searchText);

                    this.onTasksChanged.next(this.tasks);

                    resolve(this.tasks);

                }, reject);
        });
    }

    /**
     * Get tasks by priority
     *
     * @param handle
     * @returns {Promise<Task[]>}
     */
    getTasksByPriority(handle): Promise<Task[]> {
        return new Promise((resolve, reject) => {

            let searchTaskBody = new SearchTaskBody();
            if (this.selectedEmployee) {
                searchTaskBody.employeeId = this.selectedEmployee.id;
            }
            if (this.selectedProject) {
                searchTaskBody.projectId = this.selectedProject.id;
            }
            // TODO : CHECK USER ROLE
            /*else {
                searchBody.assignToId = this.currentUser.id;
            }*/
            this._httpClient.post(this.serviceURL + '/find', searchTaskBody, this.httpOptions)
                .subscribe((ret: any) => {

                    this.filteredTasks = ret['response'].map(task => {
                        return new Task(task);
                    });

                    this.tasks = FuseUtils.filterArrayByString(this.filteredTasks, this.searchText);

                    this.onTasksChanged.next(this.tasks);

                    resolve(this.tasks);

                }, reject);
        });
    }

    /**
     * Toggle selected task by id
     *
     * @param id
     */
    toggleSelectedTask(id): void {
        // First, check if we already have that task as selected...
        if (this.selectedTasks.length > 0) {
            for (const task of this.selectedTasks) {
                // ...delete the selected task
                if (task.id === id) {
                    const index = this.selectedTasks.indexOf(task);

                    if (index !== -1) {
                        this.selectedTasks.splice(index, 1);

                        // Trigger the next event
                        this.onSelectedTasksChanged.next(this.selectedTasks);

                        // Return
                        return;
                    }
                }
            }
        }

        // If we don't have it, push as selected
        this.selectedTasks.push(
            this.tasks.find(task => {
                return task.id === id;
            })
        );

        // Trigger the next event
        this.onSelectedTasksChanged.next(this.selectedTasks);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedTasks.length > 0) {
            this.deselectTasks();
        } else {
            this.selectTasks();
        }
    }

    /**
     * Select tasks
     *
     * @param filterParameter
     * @param stateValue
     */
    selectTasks(filterParameter?, stateValue?): void {
        this.selectedTasks = [];

        // If there is no state, select all tasks
        if (filterParameter === undefined || stateValue === undefined) {
            this.selectedTasks = this.tasks;
        } else {
            this.selectedTasks.push(...
                this.tasks.filter(task => {
                    return task[filterParameter] === stateValue;
                })
            );
        }

        // Trigger the next event
        this.onSelectedTasksChanged.next(this.selectedTasks);
    }

    /**
     * Deselect tasks
     */
    deselectTasks(): void {
        this.selectedTasks = [];

        // Trigger the next event
        this.onSelectedTasksChanged.next(this.selectedTasks);
    }

    /**
     * Set current task by id
     *
     * @param id
     */
    setCurrentTask(id): void {

        this.currentTask = this.tasks.find(task => {
            return task.id === id;
        });

        this.onCurrentTaskChanged.next([this.currentTask, 'edit']);

        const priorityHandle = this.routeParams.priorityHandle,
            stateHandle = this.routeParams.stateHandle;

        if (priorityHandle) {
            this._location.go('/main/tasks/priority/' + priorityHandle + '/' + id);
        } else if (stateHandle) {
            this._location.go('/main/tasks/state/' + stateHandle + '/' + id);
        } else {
            this._location.go('/main/tasks/all/' + id);
        }
    }

    /**
     * Toggle priority on task
     *
     * @param priority
     * @param task
     */
    togglePriorityOnTask(priority, task): void {
        task.priority = priority;
        this.updateTask(task);
    }

    /**
     * Toggle state on task
     *
     * @param state
     * @param task
     */
    toggleStateOnTask(state, task): void {
        task.state = state;
        this.updateTask(task);
    }

    toggleEmployeeOnTask(employee, task): void {
        task.employee = employee;
        this.updateTask(task);
    }

    toggleProjectOnTask(project, task): void {
        task.project = project;
        this.updateTask(task);
    }

    /**
     * Toggle priority on selected tasks
     *
     * @param priority
     */
    togglePriorityOnSelectedTasks(priority): void {
        this.selectedTasks.map(task => {
            this.togglePriorityOnTask(priority, task);
        });
    }

    /**
     * Toggle state on selected tasks
     *
     * @param state
     */
    toggleStateOnSelectedTasks(state): void {
        this.selectedTasks.map(task => {
            this.toggleStateOnTask(state, task);
        });
    }

    toggleEmployeeOnSelectedTasks(employee): void {
        this.selectedTasks.map(task => {
            this.toggleStateOnTask(employee, task);
        });
    }

    onEmployeeSelected(employee): any {
        return new Promise((resolve, reject) => {
            if (employee) {
                this.selectedEmployee = employee;
                this.onSelectedEmployeeChanged.next(this.selectedEmployee);
            } else {
                this.selectedEmployee = null;
                this.onSelectedEmployeeChanged.next(this.selectedEmployee);
            }
            this.getTasks().then(tasks => {
                resolve(tasks);
            }, reject);

        });
    }

    onProjectSelected(project): any {
        return new Promise((resolve, reject) => {
            if (project) {
                this.selectedProject = project;
                this.onSelectedProjectChanged.next(this.selectedProject);
            } else {
                this.selectedProject = null;
                this.onSelectedProjectChanged.next(this.selectedProject);
            }
            this.getTasks().then(tasks => {
                resolve(tasks);
            }, reject);

        });
    }

    onNoEmployeeSelected(): any {
        return new Promise((resolve, reject) => {
            this.selectedEmployee = null;
            this.getTasks().then(tasks => {

                resolve(tasks);

            }, reject);

        });
    }

    /**
     * Create the task
     *
     * @param task
     * @returns {Promise<any>}
     */
    createTask(task): any {
        return new Promise((resolve, reject) => {

            this._httpClient.post(this.serviceURL + '/save', task, this.httpOptions)
                .subscribe(ret => {
                    if (ret['status'] === 'OK') {
                        this._toastr.success(ret['message']);
                    }
                    this.getTasks().then(tasks => {

                        resolve(tasks);

                    }, reject);
                });
        });
    }

    /**
     * Update the task
     *
     * @param task
     * @returns {Promise<any>}
     */
    updateTask(task): any {
        return new Promise((resolve, reject) => {

            this._httpClient.put(this.serviceURL + '/update', task, this.httpOptions)
                .subscribe(ret => {

                    this.getTasks().then(tasks => {

                        resolve(tasks);

                    }, reject);
                });
        });
    }

    /**
     * Update the task
     *
     * @param taskId
     * @returns {Promise<any>}
     */
    deleteTask(taskId): any {
        return new Promise((resolve, reject) => {

            this._httpClient.delete(this.serviceURL + '/' + taskId + '/delete', this.httpOptions)
                .subscribe(ret => {

                    if (ret['status'] === 'OK') {
                        this._toastr.success(ret['message']);
                    }

                    this.getTasks().then(tasks => {

                        resolve(tasks);

                    }, reject);
                });
        });
    }

}
