import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../@fuse/components';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxSpinnerModule} from 'ngx-spinner';
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
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ConfirmDialogModule} from '../confirm-dialog/confirm-dialog.module';
import {SpendsComponent} from './spends/spends.component';
import {SpendsService} from './spends/spends.service';
import {DisbursementComponent} from './disbursement/disbursement.component';
import {IConfig, NgxMaskModule} from 'ngx-mask';
import {DialogModule} from 'primeng/dialog';
import {SpendDetailsComponent} from './spend-details/spend-details.component';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'spends',
        component: SpendsComponent,
        resolve: {
            data: SpendsService
        }
    },
];

@NgModule({
    declarations: [
        SpendsComponent,
        DisbursementComponent,
        SpendDetailsComponent
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
        DialogModule
    ],
    providers: [],
    entryComponents: [
        DisbursementComponent,
        SpendDetailsComponent
    ]
})
export class ExpenseManagementModule {

}