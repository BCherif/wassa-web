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