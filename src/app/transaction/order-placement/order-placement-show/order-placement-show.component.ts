import { Component, OnInit } from '@angular/core';
import { OrderPlacementService } from '../order-placement.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderPlacement } from '../order-placement';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';

declare const $: any;

@Component({
  selector: 'app-order-placement-show',
  templateUrl: './order-placement-show.component.html',
  styleUrls: ['./order-placement-show.component.css']
})
export class OrderPlacementShowComponent implements OnInit {

  orders : OrderPlacement[] = [];


  constructor(private orderPlacementService : OrderPlacementService, 
              private notificationService : NotificationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.orderPlacementService.findAll().subscribe(orders => {
      this.orders = orders;
    });
  }

  delete(order : OrderPlacement) {
    this.orderPlacementService.delete(order.orderId).subscribe(
      (response : ServerResponse) => {
        console.log("Delete Response >>>>");
        console.log(response);
        this.notificationService.openSnackBar(response.message, response.status);
        this.findAll();
    });
  }

  openDialog(order : OrderPlacement): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.delete(order);
      }
    });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  downloadInvoice(orderId : string) {
    this.orderPlacementService.downloadInvoice(orderId);
  }

  downloadFile(data: Blob) {
   // const blob = new Blob([data], { type: 'application/pdf' });
    const url= window.URL.createObjectURL(data);
    let pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            alert( 'Please disable your Pop-up blocker and try again.');
        }
  }
}
