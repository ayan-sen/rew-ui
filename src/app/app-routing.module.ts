import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderPlacementComponent } from './transaction/order-placement/order-placement.component';
import { OrderPlacementShowComponent } from './transaction/order-placement/order-placement-show/order-placement-show.component';
import { ProjectComponent } from './transaction/project/project.component';
import { ProjectShowComponent } from './transaction/project/project-show/project-show.component';
import { OrderDeliveryComponent } from './transaction/order-delivery/order-delivery.component';
import { OrderDeliveryShowComponent } from './transaction/order-delivery/order-delivery-show/order-delivery-show.component';
import { OrderProcessingComponent } from './transaction/order-processing/order-processing.component';
import { OrderProcessingShowComponent } from './transaction/order-processing/order-processing-show/order-processing-show.component';

 
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
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
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
