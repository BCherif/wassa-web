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
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {IConfig, NgxMaskModule} from 'ngx-mask';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {NatureRequestFormDialogComponent} from './nature-request-form/nature-request.component';
import {NatureRequestComponent} from './nature-request/nature-request.component';
import {NatureRequestService} from './nature-request/nature-request.service';
import {RequestTypeComponent} from './request-types/request-types.component';
import {RequestTypesService} from './request-types/request-types.service';
import {CategoriesComponent} from './categories/categories.component';
import {CategoriesService} from './categories/categories.service';
import {RequestTypeFormDialogComponent} from './request-type-form/request-type-formcomponent';
import {CategoryFormDialogComponent} from './category-form/category-form.component';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'nature-request',
        component: NatureRequestComponent,
        resolve: {
            data: NatureRequestService
        }
    },
    {
        path: 'request-types',
        component: RequestTypeComponent,
        resolve: {
            data: RequestTypesService
        }
    },
    {
        path: 'categories',
        component: CategoriesComponent,
        resolve: {
            data: CategoriesService
        }
    }
];

@NgModule({
    declarations: [
        CategoriesComponent,
        NatureRequestComponent,
        RequestTypeComponent,
        NatureRequestFormDialogComponent,
        RequestTypeFormDialogComponent,
        CategoryFormDialogComponent
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
        NatureRequestFormDialogComponent,
        RequestTypeFormDialogComponent,
        CategoryFormDialogComponent
    ]
})
export class WassaManagementModule {

}