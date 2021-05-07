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
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {IConfig, NgxMaskModule} from 'ngx-mask';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {ActivitiesComponent} from './activities/activities.component';
import {ActivitiesService} from './activities/activities.service';
import {ActivityComponent} from './activity/activity.component';
import {ActivityService} from './activity/activity.service';
import {ExpenseFormComponent} from './expense-form/expense-form.component';
import {ApproveActivityComponent} from './approve-activity/approve-activity.component';
import {ApproveActivityService} from './approve-activity/approve-activity.service';
import {MatMenuModule} from '@angular/material/menu';
import {DataViewModule} from 'primeng/dataview';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MatRadioModule} from '@angular/material/radio';
import {ValidateActivityService} from './validate-activity/validate-activity.service';
import {ValidateActivityComponent} from './validate-activity/validate-activity.component';
import {ActivityDetailsComponent} from './activity-details/activity-details.component';
import {ActivityDetailsService} from './activity-details/activity-details.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'activities',
        component: ActivitiesComponent,
        resolve: {
            data: ActivitiesService
        }
    },
    {
        path: 'activities/:id',
        component: ActivityComponent,
        resolve: {
            data: ActivityService
        }
    },
    {
        path: 'activities/:id/:title',
        component: ActivityComponent,
        resolve: {
            data: ActivityService
        }
    },
    {
        path: 'approved/:id',
        component: ApproveActivityComponent,
        resolve: {
            data: ApproveActivityService
        }
    },
    {
        path: 'validate/:id',
        component: ValidateActivityComponent,
        resolve: {
            data: ValidateActivityService
        }
    },
    {
        path: 'disbursement/:id',
        component: ActivityDetailsComponent,
        resolve: {
            data: ActivityDetailsService
        }
    }
];

@NgModule({
    declarations: [
        ActivitiesComponent,
        ActivityComponent,
        ExpenseFormComponent,
        ApproveActivityComponent,
        ValidateActivityComponent,
        ActivityDetailsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        NgxMaskModule.forRoot(maskConfig),
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
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCardModule,
        MatDividerModule,
        MatInputModule,
        NgxMaskModule,
        MatTabsModule,
        MatToolbarModule,
        MatDialogModule,
        MatMenuModule,
        DataViewModule,
        ButtonModule,
        DialogModule,
        InputTextareaModule,
        MatRadioModule
    ],
    providers: [],
    entryComponents: [
        ExpenseFormComponent
    ]
})
export class ExpensesManagementModule {

}