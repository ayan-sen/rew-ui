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
  { path: 'expense/add', component: ExpenseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
