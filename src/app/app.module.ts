import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { UnitComponent } from './admin/unit/unit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RawMaterialComponent } from './admin/raw-material/raw-material.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ClientComponent } from './admin/client/client.component';
import { ClientShowComponent } from './admin/client/client-show/client-show.component';
import { CommonDialogComponent } from './components/common-commponents/common-dialog/common-dialog.component';
import { environment } from 'src/environments/environment';
import { ApiInceptorService } from './components/common-service/api-inceptor.service';
import { OrderPlacementComponent } from './transaction/order-placement/order-placement.component';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { ModalModule, TooltipModule, PopoverModule, ButtonsModule } from 'angular-bootstrap-md'
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    MenuListItemComponent,
    UnitComponent,
    RawMaterialComponent,
    ClientComponent,
    ClientShowComponent,
    CommonDialogComponent,
    OrderPlacementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    MatTableModule,
    MatDatepickerModule,
    [ModalModule.forRoot()],
    TooltipModule,
    PopoverModule,
    ButtonsModule,
    MatNativeDateModule,
    MatRippleModule
  ],
  providers: [
    { provide: "BASE_API_URL", useValue: environment.baseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
