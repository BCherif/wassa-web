import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';

import {FuseModule} from '@fuse/fuse.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '@fuse/components';

import {fuseConfig} from 'app/fuse-config';
import localeFr from '@angular/common/locales/fr';

import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';
import {SampleModule} from 'app/main/sample/sample.module';
import {ToastrModule} from 'ngx-toastr';
import {AuthGuard} from './shared/guard/auth.guard';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';

registerLocaleData(localeFr);

const appRoutes: Routes = [
    /* {
         path: '**',
         redirectTo: 'sample'
     },*/
    {
        path: '',
        redirectTo: 'main/budget-management/budgets',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./main/authentication/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        ToastrModule.forRoot({
                closeButton: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: 'toast-top-right',
                preventDuplicates: false,
                timeOut: 3000,
                extendedTimeOut: 1000,
            }
        ),


        // App modules
        LayoutModule,
        SampleModule
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'fr-FR'},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
