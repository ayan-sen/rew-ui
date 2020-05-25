import { Component, OnInit } from '@angular/core';
import { OrderDeliveryService } from '../order-delivery.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDelivery } from '../order-delivery';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';

declare const $: any;

@Component({
  selector: 'app-order-delivery-show',
  templateUrl: './order-delivery-show.component.html',
  styleUrls: ['./order-delivery-show.component.css']
})
export class OrderDeliveryShowComponent implements OnInit {

  deliveries : OrderDelivery[] =[];

  constructor(private orderDeliveryService : OrderDeliveryService,
              private notificationService : NotificationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.orderDeliveryService.findAll().subscribe(deliveries => {
      this.deliveries = deliveries;
    });
  }

  delete(delivery : OrderDelivery) {
    this.orderDeliveryService.delete(delivery.deliveryId).subscribe(
      (response : ServerResponse) => {
        console.log("Delete Response >>>>");
        console.log(response);
        this.notificationService.openSnackBar(response.message, response.status);
        this.findAll();
    });
  }

  openDialog(delivery : OrderDelivery): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.delete(delivery);
      }
    });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
