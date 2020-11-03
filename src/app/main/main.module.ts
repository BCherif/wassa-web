import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '../../@fuse/shared.module';
import {NgModule} from '@angular/core';

const routes = [
    {
        path: 'administration',
        loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
    },
    {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
    },
    {
        path: 'budget-management',
        loadChildren: () => import('./budget-management/budget-management.module').then(m => m.BudgetManagementModule)
    },
    {
        path: 'staff_management',
        loadChildren: () => import('./staff_management/staff-management.module').then(m => m.StaffManagementModule)
    },
    {
        path: 'expense_management',
        loadChildren: () => import('./expense_management/expense_management').then(m => m.ExpenseManagementModule)
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class MainModule {
}