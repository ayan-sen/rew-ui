import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/admin/client/client';
import { ClientService } from 'src/app/admin/client/client.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { OrderDespatchService } from 'src/app/transaction/order-despatch.service';
import { OrderDespatch } from 'src/app/transaction/order-despatch/order-despatch';
import { Project } from 'src/app/transaction/project/project';
import { ProjectService } from 'src/app/transaction/project/project.service';
import { PayService } from '../../pay.service';
import { Pay } from '../pay';

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
      'clientId': new FormControl('', Validators.required)
      // 'fromDate': new FormControl(null, Validators.required),
      // 'fromDateString': new FormControl(''),
      // 'toDate': new FormControl(null),
      // 'toDateString': new FormControl('')
      
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
    
  }

}
