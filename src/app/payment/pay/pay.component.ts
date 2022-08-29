import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { Client } from 'src/app/admin/client/client';
import { ClientService } from 'src/app/admin/client/client.service';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { convertToDate } from 'src/app/components/common-service/common-uutil';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { TransactionRecord } from 'src/app/transaction/transaction-record';
import { PayService } from '../pay.service';
import { Pay } from './pay';
import { PayDetail } from './pay-detail';

declare const $: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  payForm: FormGroup;
  payDetailsForm: FormGroup;
  details: PayDetail[] = [];
  pay: Pay;
  clients : Client[] = [];
  projectAmount : number;
  projectPayment : number;
  otherPayment : number = 0.0;
  totalpayment : number = 0.0;
  amount : number = 0.0;
  paidAmount : number = 0.0;

  paymentTypes: Dropdown[] = [
    {value: 'SEND', viewValue: 'Pay'},
    {value: 'RECEIVE', viewValue: 'Receive'}
  ];
  paymentType : string;
  records : TransactionRecord[] = [];

  constructor(private payService: PayService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private clientService : ClientService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getClients();

    this.payForm = this.fb.group({
      'paymentId': new FormControl(null),
      'paymentDate': new FormControl('', Validators.required),
      'paymentDateString': new FormControl(null),
      'clientId': new FormControl('', Validators.required),
      'projectPayment': new FormControl(''),
      'otherPayment': new FormControl(0),
      'totalPayment': new FormControl(''),
      'notes': new FormControl(''),
      'paymentType': new FormControl('', Validators.required),
      'details': new FormControl('')   
    });


    this.payDetailsForm = this.fb.group({
      'paymentId': new FormControl(''),
      'paymentDetailId': new FormControl(''),
      'itemId': new FormControl('', Validators.required),
      'projectAmount': new FormControl(''),
      'amount': new FormControl('', Validators.required),
      'paidAmount': new FormControl(''),
      'deliveryId': new FormControl(''),
      'invoiceId': new FormControl('')
    }
    );

    this.route.queryParams.subscribe(param => {
      if (Object.keys(param).length > 0) {
        this.payService.findById(param.id).subscribe((pay: Pay) => {
          this.details = pay.details;
          pay.paymentDate = convertToDate(pay.paymentDateString);
          this.payForm.setValue(pay);
        });
      }
    });
  }

  onSubmit() {
    if (this.payForm.valid) {
      this.pay = this.payForm.value;
      this.pay.details = this.details;

      if (this.payForm.value.paymentDate != null) {
        this.pay.paymentDateString = this.datePipe.transform(this.payForm.value.paymentDate, 'dd/MM/yyyy');
      }
      this.payService.save(this.pay).subscribe(
        (response: ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          console.log("success response ::");
          console.log(response);
          this.payForm.reset();
          this.details = [];
        },
        (errorMsg: HttpErrorResponse) => {
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log("error response ::");
          console.log(errorMsg.message);
        }
      );
    } else {
      return;
    }
  }

  onDetailSubmit(frame : ModalDirective) {
    if (this.payDetailsForm.valid) {
      let newDetail: PayDetail = this.payDetailsForm.value;
      let paymentId = newDetail.paymentId;
      let index: number = -1;
      // if (paymentId != null) {
      //   index = this.details.findIndex(detail => detail.paymentId == paymentId);
      // } else {
        index = this.details.findIndex(detail => detail.itemId == newDetail.itemId);
     /// }
      console.log("last index >>" + index);
      if (index != -1) {
        this.details[index] = this.payDetailsForm.value;
        this.notificationService.openSnackBar("Details updated successfully", "success");
      } else {
        this.details.push(this.payDetailsForm.value);
        this.notificationService.openSnackBar("Details added successfully", "success");
      }
      this.calculateHeader();
      this.payDetailsForm.reset();
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }
  
  close(frame : ModalDirective)  {
    this.payDetailsForm.reset();
    frame.hide();
  }

  editDetail(payDetail: PayDetail, frame : ModalDirective) {
    this.payDetailsForm.setValue(payDetail);
    frame.show();
  }

  openDialog(payDetail: PayDetail): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDetail(payDetail);
      }
    });
  }


  deleteDetail(payDetail: PayDetail) {
    let index = this.calculateDetailIndex(payDetail);
    if (payDetail.paymentDetailId) {
      this.payService.deleteDetail(payDetail.paymentId, payDetail.paymentDetailId)
      .subscribe((response: ServerResponse) => {
        this.details.splice(index, 1);
        this.calculateHeader();
        this.notificationService.openSnackBar(response.message, response.status);
      }, (errorMsg: HttpErrorResponse) => {
        this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
        console.log("error response ::");
        console.log(errorMsg.message);
      });
    } else {
      if (index !== -1) {
        this.details.splice(index, 1);
        this.notificationService.openSnackBar("Details removed successfully", "success");
      }
    }
   
  }


  calculateDetailIndex(payDetail: PayDetail): number {
    let index: number = -1;
    if (payDetail.paymentDetailId != null) {
      index = this.details.findIndex(detail => detail.paymentDetailId == payDetail.paymentDetailId);
    } else {
      index = this.details.findIndex(detail => detail.paymentDetailId == payDetail.paymentDetailId);
    }
    return index;
  }

  getClients() {
    this.clientService.findAll().subscribe(clients => {
      this.clients = clients;
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.payForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.payDetailsForm.controls[controlName].hasError(errorName); 
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  
  modalWIdth() : string {
    return this.isMobileMenu() ? "100%" : "150%";
  }

  populatDetailLists(event : MatSelectChange) {
    let clientId = event.value;
    this.payService.findOrdersByClient(clientId, this.paymentType)
        .subscribe(records=> {
          this.records = records;
          this.details = this.records.map(rec => this.populateRow(rec));
    })
  }

  populateRow(record : TransactionRecord) : PayDetail {
    
    let payDetail : PayDetail = new PayDetail();
    payDetail.itemId = record.referenceId;
    payDetail.projectAmount = record.totalAmount;
    payDetail.paymentId = "";
    payDetail.paymentDetailId = null;
    payDetail.amount = 0;
    payDetail.paidAmount = record.paidAmount;
    payDetail.deliveryId ='';
    payDetail.invoiceId='';
    return payDetail;
    
  }

  calculateHeader() {
    this.projectPayment = this.details.map(d => d.amount).reduce((p, n) => Number.parseFloat(p.toString()) + Number.parseFloat(n.toString()), 0.0);
    this.totalpayment = this.projectPayment;
    if(this.otherPayment != null) {
      this.totalpayment =  Number.parseFloat(this.projectPayment.toString()) +  Number.parseFloat(this.otherPayment.toString());
    }
    
  }

  resetGrid() {
    this.details = [];
  }
}
