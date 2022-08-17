import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { InvoiceService } from '../../invoice.service';
import { Invoice } from '../invoice';

declare const $: any;

@Component({
  selector: 'app-invoice-show',
  templateUrl: './invoice-show.component.html',
  styleUrls: ['./invoice-show.component.css']
})
export class InvoiceShowComponent implements OnInit {

  invoices : Invoice[] =[];

  constructor(private invoiceService : InvoiceService, 
              private notificationService : NotificationService,
              public dialog: MatDialog) { }

ngOnInit(): void {
  this.findAll();
}
            
findAll() {
  this.invoiceService.findAll().subscribe(invoices => {
    this.invoices = invoices;
  });
}

delete(invoice : Invoice) {
  this.invoiceService.delete(invoice.invoiceId).subscribe(
    (response : ServerResponse) => {
      console.log("Delete Response >>>>");
      console.log(response);
      this.notificationService.openSnackBar(response.message, response.status);
      this.findAll();
  });
}

openDialog(invoice : Invoice): void {
  const dialogRef = this.dialog.open(CommonDialogComponent, {
    width: '250px',
    data: { header : "Confirm",
            content : "Are you sure to delete?" 
          }
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      this.delete(invoice);
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
