import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalModule, TooltipModule, PopoverModule, ButtonsModule } from 'angular-bootstrap-md';
import { PayComponent } from './pay/pay.component';
import { PayShowComponent } from './pay/pay-show/pay-show.component';


@NgModule({
  declarations: [PayComponent, PayShowComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
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
    MatRippleModule,
    MatChipsModule 
  ]
})
export class PaymentModule { }
