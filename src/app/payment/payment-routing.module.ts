import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayShowComponent } from './pay/pay-show/pay-show.component';
import { PayComponent } from './pay/pay.component';


const routes: Routes = [
  { path: 'payment/add', component: PayComponent },
  { path: 'payment/edit', component: PayComponent },
  { path: 'payments', component: PayShowComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
