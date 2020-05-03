import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnitComponent } from './admin/unit/unit.component';
import { RawMaterialComponent } from './admin/raw-material/raw-material.component';
import { ClientComponent } from './admin/client/client.component';
import { ClientShowComponent } from './admin/client/client-show/client-show.component';
import { OrderPlacementComponent } from './transaction/order-placement/order-placement.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'unit', component: UnitComponent },
  { path: 'raw-material', component: RawMaterialComponent },
  { path: 'client/add', component: ClientComponent },
  { path: 'clients', component: ClientShowComponent },
  { path: 'clients/:clientId', component: ClientComponent },
  { path: 'order-placement/add', component: OrderPlacementComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
