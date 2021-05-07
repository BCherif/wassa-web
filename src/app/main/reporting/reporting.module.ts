import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import {FuseSharedModule} from '@fuse/shared.module';

import {FuseSidebarModule} from '@fuse/components';
import {ReportsComponent} from './reports/reports.component';
import {ReportsService} from './reports.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatRippleModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableExporterModule} from 'mat-table-exporter';

const routes = [
    {
        path: 'reports',
        component: ReportsComponent,
        resolve: {
            academy: ReportsService
        }
    }
];

@NgModule({
    declarations: [
        ReportsComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,

        FuseSharedModule,
        FuseSidebarModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatTableModule,
        MatSortModule,
        MatRippleModule,
        MatToolbarModule,
        MatTableExporterModule
    ],
    providers: []
})
export class ReportingModule {
}
