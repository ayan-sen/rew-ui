import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './components/common-service/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

 
const routes: Routes = [
  
  { path: '', redirectTo: '', pathMatch: 'full', canActivate: [ AuthGuardService ]   },
  { path: '', 
    component: AdminLayoutComponent,
    canActivate: [ AuthGuardService ],
    children : [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'  },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule) }
    ]  
  },
  { path: 'login', component: LoginComponent },
  
  
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
