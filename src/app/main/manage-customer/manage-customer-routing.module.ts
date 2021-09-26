import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CostumerComponent } from './costumer/costumer.component';

const routes: Routes = [
    {
        path: 'customer',
        component: CostumerComponent,
       
    },
    {
        path: 'add-customer',
        component: AddCustomerComponent,
       
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCustomerRoutingModule { }
