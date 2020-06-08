import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitComponent } from './unit/unit.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ClientComponent } from './client/client.component';
import { ClientShowComponent } from './client/client-show/client-show.component';


const routes: Routes = [
  { path: 'unit', component: UnitComponent },
  { path: 'raw-material', component: RawMaterialComponent },
  { path: 'client/add', component: ClientComponent },
  { path: 'clients', component: ClientShowComponent },
  { path: 'clients/:clientId', component: ClientComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
