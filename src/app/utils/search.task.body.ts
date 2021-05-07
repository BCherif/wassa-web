import {TASK_PRIORITY, TASK_STATE} from '../data/enums/enums';

export class SearchTaskBody {
    employeeId: number;
    projectId: number;
    taskState: TASK_STATE;
    taskPriority: TASK_PRIORITY;
}