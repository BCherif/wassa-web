import {RouterModule, Routes} from '@angular/router';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../@fuse/components';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatRippleModule} from '@angular/material/core';
import {CategoriesService} from './categories/categories.service';
import {CategoriesComponent} from './categories/categories.component';
import {CategoryFormComponent} from './category-form/category-form.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {UnitsService} from './units/units.service';
import {UnitsComponent} from './units/units.component';
import {UnityFormComponent} from './unity-form/unity-form.component';
import {MatSelectModule} from '@angular/material/select';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectsService} from './projects/projects.service';
import {ProjectFormComponent} from './project-form/project-form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {PartnersComponent} from './partners/partners.component';
import {PartnersService} from './partners/partners.service';
import {PartnerFormComponent} from './partner-form/partner-form.component';
import {JobsComponent} from './jobs/jobs.component';
import {JobsService} from './jobs/jobs.service';
import {JobFormComponent} from './job-form/job-form.component';
import {DepartmentsComponent} from './departments/departments.component';
import {DepartmentsService} from './departments/departments.service';
import {DepartmentFormComponent} from './department-form/department-form.component';

const routes: Routes = [
    {
        path: 'categories',
        component: CategoriesComponent,
        resolve: {
            data: CategoriesService
        }
    },
    {
        path: 'projects',
        component: ProjectsComponent,
        resolve: {
            data: ProjectsService
        }
    },
    {
        path: 'units',
        component: UnitsComponent,
        resolve: {
            data: UnitsService
        }
    },
    {
        path: 'departments',
        component: DepartmentsComponent,
        resolve: {
            data: DepartmentsService
        }
    },
    {
        path: 'jobs',
        component: JobsComponent,
        resolve: {
            data: JobsService
        }
    },
    {
        path: 'partners',
        component: PartnersComponent,
        resolve: {
            data: PartnersService
        }
    }
];

@NgModule({
    declarations: [
        CategoriesComponent,
        CategoryFormComponent,
        UnitsComponent,
        UnityFormComponent,
        JobFormComponent,
        ProjectsComponent,
        ProjectFormComponent,
        PartnersComponent,
        PartnerFormComponent,
        JobsComponent,
        DepartmentsComponent,
        DepartmentFormComponent
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
        MatRippleModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatDialogModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    providers: [],
    entryComponents: [
        CategoryFormComponent,
        UnityFormComponent,
        ProjectFormComponent,
        PartnerFormComponent,
        JobFormComponent,
        DepartmentFormComponent
    ]
})
export class ConfigurationModule {

}