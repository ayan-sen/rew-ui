import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/admin/client/client';
import { ClientService } from 'src/app/admin/client/client.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { PayService } from '../../pay.service';
import { Pay } from '../pay';
import { PaymentSummary } from '../payment-summary';
import { PaymentView } from '../payment-view';

@Component({
  selector: 'app-pay-show',
  templateUrl: './pay-show.component.html',
  styleUrls: ['./pay-show.component.css']
})
export class PayShowComponent implements OnInit {

  payForm : FormGroup;
  projectId : string;

  payments : Pay[] = [];

  clients : Client[] = [];

  fromDate : Date;
  toDate : Date;
  fromDateString : string;
  toDateString : string;
  clientId: string;
  paymentView : PaymentView = null;
  isSearched: boolean = false;
  summary : PaymentSummary;

  constructor(private payService : PayService,
              private clientService : ClientService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private notificationService : NotificationService,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getClients();

    this.payForm = this.fb.group({
      'clientId': new FormControl(''),
      'fromDate': new FormControl(''),
      'fromDateString': new FormControl(''),
      'toDate': new FormControl(null),
      'toDateString': new FormControl('')
      
    });


  }

  getClients() {
    this.clientService.findAll().subscribe(clients => {
      this.clients = clients;
    });
  }


  populatDetailLists(event : MatSelectChange) {
    let clientId = event.value;
    this.payService.findByCLientId(clientId).subscribe(
      payments => {
        this.payments = payments;
      }
    );
  }


  onSubmit() {
    if (this.payForm.valid) {
      this.fromDate = this.payForm.value.fromDate;
      this.toDate = this.payForm.value.toDate;
      this.clientId = this.payForm.value.clientId;
      if(this.payForm.value.fromDate != null) {
        this.fromDateString = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
      }
      if(this.payForm.value.toDate != null) {
        this.toDateString = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
      }

      
      this.payService.findPaymentReport(this.clientId, this.fromDateString, this.toDateString).subscribe(
        summary => {
          this.summary = summary;
          this.payments = this.summary.details;
          this.paymentView = this.summary.view;
        }
      );
      console.log(this.paymentView);  
      this.isSearched = true;
    }
  }

}
