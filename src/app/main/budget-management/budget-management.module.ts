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
import {BudgetsComponent} from './budgets/budgets.component';
import {BudgetsService} from './budgets/budgets.service';
import {BudgetComponent} from './budget/budget.component';
import {BudgetService} from './budget/budget.service';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {BudgetDetailsComponent} from './budget-details/budget-details.component';
import {BudgetDetailsService} from './budget-details/budget-details.service';
import {MatTabsModule} from '@angular/material/tabs';
import {LinePartnerComponent} from './line-partner/line-partner.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

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
    }
];

@NgModule({
    declarations: [
        BudgetsComponent,
        BudgetComponent,
        BudgetDetailsComponent,
        LinePartnerComponent
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
        MatDatepickerModule
    ],
    providers: [BudgetService],
    entryComponents: [LinePartnerComponent]
})
export class BudgetManagementModule {

}