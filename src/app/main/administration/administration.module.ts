import {RouterModule, Routes} from '@angular/router';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../@fuse/components';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {UsersComponent} from './users/users.component';
import {UsersService} from './users/users.service';
import {RolesComponent} from './roles/roles.component';
import {RolesService} from './roles/roles.service';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatRippleModule} from '@angular/material/core';

const routes: Routes = [
    {
        path: 'users',
        component: UsersComponent,
        resolve: {
            data: UsersService
        }
    },
    {
        path: 'roles',
        component: RolesComponent,
        resolve: {
            data: RolesService
        }
    }
]

@NgModule({
    declarations: [
        RolesComponent,
        UsersComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
        MatCheckboxModule,
        NgxSpinnerModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatRippleModule
    ],
    providers   : [],
    entryComponents: []
})
export class AdministrationModule{

}