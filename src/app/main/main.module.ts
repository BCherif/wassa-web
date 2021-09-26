import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '../../@fuse/shared.module';
import {NgModule} from '@angular/core';

const routes = [
    {
        path: 'administration',
        loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
    },
    {
        path: 'wassa-management',
        loadChildren: () => import('./wassa-management/wassa-management.module').then(m => m.WassaManagementModule)
    },
    {
        path: 'manage-customer',
        loadChildren: () => import('./manage-customer/manage-customer.module').then(m => m.ManageCustomerModule)
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule
    ],
    declarations: []
})
export class MainModule {
}