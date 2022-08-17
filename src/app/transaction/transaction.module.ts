import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { OrderPlacementComponent } from './order-placement/order-placement.component';
import { ProjectComponent } from './project/project.component';
import { OrderPlacementShowComponent } from './order-placement/order-placement-show/order-placement-show.component';
import { ProjectShowComponent } from './project/project-show/project-show.component';
import { OrderDeliveryComponent } from './order-delivery/order-delivery.component';
import { OrderDeliveryShowComponent } from './order-delivery/order-delivery-show/order-delivery-show.component';
import { OrderProcessingComponent } from './order-processing/order-processing.component';
import { OrderProcessingShowComponent } from './order-processing/order-processing-show/order-processing-show.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModalModule, TooltipModule, PopoverModule, ButtonsModule } from 'angular-bootstrap-md';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseShowComponent } from './expense/expense-show/expense-show.component';
import { OrderDespatchComponent } from './order-despatch/order-despatch.component';
import { OrderDespatchShowComponent } from './order-despatch/order-despatch-show/order-despatch-show.component';
import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [
    OrderPlacementComponent,
    ProjectComponent,
    OrderPlacementShowComponent,
    ProjectShowComponent,
    OrderDeliveryComponent,
    OrderDeliveryShowComponent,
    OrderProcessingComponent,
    OrderProcessingShowComponent,
    ExpenseComponent,
    ExpenseShowComponent,
    OrderDespatchComponent,
    OrderDespatchShowComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
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
export class TransactionModule { }
