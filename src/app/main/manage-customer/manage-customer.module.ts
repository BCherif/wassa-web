import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCustomerRoutingModule } from './manage-customer-routing.module';
import { CostumerComponent } from './costumer/costumer.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { AddCustomerComponent } from './add-customer/add-customer.component';


@NgModule({
    declarations: [CostumerComponent, AddCustomerComponent],
    imports: [
        CommonModule,
        ManageCustomerRoutingModule,
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
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
    ]
})
export class ManageCustomerModule { }
