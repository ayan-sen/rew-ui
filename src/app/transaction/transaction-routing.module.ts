import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPlacementComponent } from './order-placement/order-placement.component';
import { OrderPlacementShowComponent } from './order-placement/order-placement-show/order-placement-show.component';
import { ProjectComponent } from './project/project.component';
import { ProjectShowComponent } from './project/project-show/project-show.component';
import { OrderDeliveryComponent } from './order-delivery/order-delivery.component';
import { OrderDeliveryShowComponent } from './order-delivery/order-delivery-show/order-delivery-show.component';
import { OrderProcessingComponent } from './order-processing/order-processing.component';
import { OrderProcessingShowComponent } from './order-processing/order-processing-show/order-processing-show.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseShowComponent } from './expense/expense-show/expense-show.component';
import { OrderDespatchComponent } from './order-despatch/order-despatch.component';
import { OrderDespatchShowComponent } from './order-despatch/order-despatch-show/order-despatch-show.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceShowComponent } from './invoice/invoice-show/invoice-show.component';

const routes: Routes = [
  { path: 'order-placement/add', component: OrderPlacementComponent },
  { path: 'orders/edit', component: OrderPlacementComponent },
  { path: 'orders', component: OrderPlacementShowComponent },
  { path: 'project/add', component: ProjectComponent },
  { path: 'projects/edit', component: ProjectComponent },
  { path: 'projects', component: ProjectShowComponent },
  { path: 'order-delivery/add', component: OrderDeliveryComponent },
  { path: 'deliveries', component: OrderDeliveryShowComponent },
  { path: 'order-delivery/edit', component: OrderDeliveryComponent },
  { path: 'log/add', component: OrderProcessingComponent },
  { path: 'logs', component: OrderProcessingShowComponent },
  { path: 'log/edit', component: OrderProcessingComponent },
  { path: 'expense/add', component: ExpenseComponent },
  { path: 'expenses', component: ExpenseShowComponent },
  { path: 'despatch/add', component: OrderDespatchComponent },
  { path: 'despatches', component: OrderDespatchShowComponent },
  { path: 'despatch/edit', component: OrderDespatchComponent },
  { path: 'invoice/add', component: InvoiceComponent },
  { path: 'invoice/edit', component: InvoiceComponent },
  { path: 'invoices', component: InvoiceShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
