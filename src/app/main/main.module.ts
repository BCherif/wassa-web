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
        path: 'expenses-management',
        loadChildren: () => import('./expenses-management/expenses-management.module').then(m => m.ExpensesManagementModule)
    },
    {
        path: 'staff-management',
        loadChildren: () => import('./staff-management/staff-management.module').then(m => m.StaffManagementModule)
    },
    {
        path: 'reporting',
        loadChildren: () => import('./reporting/reporting.module').then(m => m.ReportingModule)
    },
    {
        path: 'tasks',
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule)
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