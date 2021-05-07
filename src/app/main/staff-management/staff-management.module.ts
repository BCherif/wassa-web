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
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import {NgxMaskModule, IConfig} from 'ngx-mask';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {EmployeesComponent} from './employees/employees.component';
import {EmployeesService} from './employees/employees.service';
import {EmployeeFormComponent} from './employee-form/employee-form.component';
import {QuillModule} from 'ngx-quill';
import {ConfirmDialogModule} from '../confirm-dialog/confirm-dialog.module';
import {DialogModule} from 'primeng/dialog';
import {DataViewModule} from 'primeng/dataview';
import {ButtonModule} from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'employees',
        component: EmployeesComponent,
        resolve: {
            data: EmployeesService
        }
    }
];

@NgModule({
    declarations: [
        EmployeesComponent,
        EmployeeFormComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        NgxMaskModule.forRoot(maskConfig),
        QuillModule.forRoot(),
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
        MatCardModule,
        MatDividerModule,
        MatTabsModule,
        MatDatepickerModule,
        ConfirmDialogModule,
        DialogModule,
        DataViewModule,
        ButtonModule,
        InputTextareaModule,
        RadioButtonModule,
        InputNumberModule,
        InputTextModule,
        RippleModule,
        TableModule
    ],
    providers: [],
    entryComponents: [
        EmployeeFormComponent
    ]
})
export class StaffManagementModule {

}