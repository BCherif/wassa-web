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
        loadChildren: () => import('./budget-management/buget-management.module').then(m => m.BugetManagementModule)
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