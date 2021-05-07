import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxDnDModule} from '@swimlane/ngx-dnd';

import {FuseSharedModule} from '@fuse/shared.module';
import {TaskComponent} from './task.component';
import {TaskService} from './task.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {FuseSidebarModule} from '@fuse/components';
import {TaskMainSidebarComponent} from './sidebars/main/main-sidebar.component';
import {TaskListComponent} from './task-list/task-list.component';
import {TaskListItemComponent} from './task-list/task-list-item/task-list-item.component';
import {TaskDetailsComponent} from './task-details/task-details.component';


const routes: Routes = [
    {
        path: 'all',
        component: TaskComponent,
        resolve: {
            task: TaskService
        }
    },
    {
        path: 'current/:taskId',
        component: TaskComponent,
        resolve: {
            task: TaskService
        }
    },
    {
        path: 'priority/:priorityHandle',
        component: TaskComponent,
        resolve: {
            task: TaskService
        }
    },
    {
        path: 'priority/:priorityHandle/:taskId',
        component: TaskComponent,
        resolve: {
            task: TaskService
        }
    },
    {
        path: 'state/:stateHandle',
        component: TaskComponent,
        resolve: {
            task: TaskService
        }
    },
    {
        path: 'state/:stateHandle/:taskId',
        component: TaskComponent,
        resolve: {
            task: TaskService
        }
    },
    {
        path: '',
        redirectTo: 'all'
    }
];

@NgModule({
    declarations: [
        TaskComponent,
        TaskMainSidebarComponent,
        TaskListItemComponent,
        TaskListComponent,
        TaskDetailsComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
        MatTooltipModule,
        MatDividerModule,

        NgxDnDModule,

        FuseSharedModule,
        FuseSidebarModule,
        FuseSidebarModule
    ],
    providers: [
        TaskService
    ]
})
export class TaskModule {
}
