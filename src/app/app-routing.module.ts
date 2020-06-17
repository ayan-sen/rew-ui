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
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './components/common-service/auth-guard.service';

 
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'  },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuardService ] },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule) }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
