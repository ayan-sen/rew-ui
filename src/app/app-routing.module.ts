import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnitComponent } from './admin/unit/unit.component';
import { RawMaterialComponent } from './admin/raw-material/raw-material.component';
import { ClientComponent } from './admin/client/client.component';
import { ClientShowComponent } from './admin/client/client-show/client-show.component';
import { OrderPlacementComponent } from './transaction/order-placement/order-placement.component';
import { OrderPlacementShowComponent } from './transaction/order-placement/order-placement-show/order-placement-show.component';
import { ProjectComponent } from './transaction/project/project.component';
import { ProjectShowComponent } from './transaction/project/project-show/project-show.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'unit', component: UnitComponent },
  { path: 'raw-material', component: RawMaterialComponent },
  { path: 'client/add', component: ClientComponent },
  { path: 'clients', component: ClientShowComponent },
  { path: 'clients/:clientId', component: ClientComponent },
  { path: 'order-placement/add', component: OrderPlacementComponent },
  { path: 'orders/edit', component: OrderPlacementComponent },
  { path: 'orders', component: OrderPlacementShowComponent },
  { path: 'project/add', component: ProjectComponent },
  { path: 'projects/edit', component: ProjectComponent },
  { path: 'projects', component: ProjectShowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
