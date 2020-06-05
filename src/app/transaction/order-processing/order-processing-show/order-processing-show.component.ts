import { Component, OnInit } from '@angular/core';
import { OrderProcessingService } from '../order-processing.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderProcessing } from '../order-processing';

@Component({
  selector: 'app-order-processing-show',
  templateUrl: './order-processing-show.component.html',
  styleUrls: ['./order-processing-show.component.css']
})
export class OrderProcessingShowComponent implements OnInit {

  processes : OrderProcessing[] =[];

  constructor(private orderProcessingService : OrderProcessingService,
              private notificationService : NotificationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.orderProcessingService.findAll().subscribe(processes => {
      this.processes = processes;
    });
  }
}
