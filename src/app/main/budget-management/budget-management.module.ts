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
import {BudgetsComponent} from './budgets/budgets.component';
import {BudgetsService} from './budgets/budgets.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BudgetComponent} from './budget/budget.component';
import {BudgetService} from './budget/budget.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {IConfig, NgxMaskModule} from 'ngx-mask';
import {BudgetDetailsComponent} from './budget-details/budget-details.component';
import {BudgetDetailsService} from './budget-details/budget-details.service';
import {MatTabsModule} from '@angular/material/tabs';
import {FundingFormComponent} from './funding-form/funding-form.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {AddSubLineFormComponent} from './add-sub-line-form/add-sub-line-form.component';
import {LineDetailsComponent} from './line-details/line-details.component';
import {LineDetailsService} from './line-details/line-details.service';
import {MatBadgeModule} from '@angular/material/badge';
import {AddForecastFormComponent} from './add-forecast-form/add-forecast-form.component';
import {ValidateFormComponent} from './validate-form/validate-form.component';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'budgets',
        component: BudgetsComponent,
        resolve: {
            data: BudgetsService
        }
    },
    {
        path: 'budgets/:id',
        component: BudgetComponent,
        resolve: {
            data: BudgetService
        }
    },
    {
        path: 'budgets/:id/:title',
        component: BudgetComponent,
        resolve: {
            data: BudgetService
        }
    },
    {
        path: 'budget-details/details/:id',
        component: BudgetDetailsComponent,
        resolve: {
            data: BudgetDetailsService
        }
    },
    {
        path: 'line-details/:id',
        component: LineDetailsComponent,
        resolve: {
            data: LineDetailsService
        }
    }
];

@NgModule({
    declarations: [
        BudgetsComponent,
        BudgetComponent,
        BudgetDetailsComponent,
        FundingFormComponent,
        AddSubLineFormComponent,
        LineDetailsComponent,
        AddForecastFormComponent,
        ValidateFormComponent
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
        MatBadgeModule
    ],
    providers: [],
    entryComponents: [
        FundingFormComponent,
        AddSubLineFormComponent,
        AddForecastFormComponent,
        ValidateFormComponent
    ]
})
export class BudgetManagementModule {

}