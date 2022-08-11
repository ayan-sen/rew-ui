import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OrderDelivery } from './order-delivery';
import { OrderDeliveryDetails } from './order-delivery-details';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { OrderDeliveryService } from './order-delivery.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { ClientService } from 'src/app/admin/client/client.service';
import { RawMaterialService } from 'src/app/admin/raw-material/raw-material.service';
import { UnitService } from 'src/app/admin/unit/unit.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { isNumeric } from 'rxjs/util/isNumeric';
import { OrderPlacementService } from '../order-placement/order-placement.service';
import { OrderPlacement } from '../order-placement/order-placement';
import { MatSelectChange } from '@angular/material/select';
import { OrderPlacementDetails } from '../order-placement/order-placement-details';
import { Client } from 'src/app/admin/client/client';
import { ClientDetails } from 'src/app/admin/client/client-detail';
import { lessThanValueValidator } from 'src/app/components/common-commponents/validators/number-compare';
import { convertToDate } from 'src/app/components/common-service/common-uutil';
import { DatePipe } from '@angular/common';
import { RawMaterial } from 'src/app/admin/raw-material/raw-material';

declare const $: any;

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.css']
})
export class OrderDeliveryComponent implements OnInit {

  deliveryForm: FormGroup;

  deliveryDetailsForm: FormGroup;

  orderDelivery : OrderDelivery;
 
  details : OrderDeliveryDetails[] = [];

  orders : OrderPlacement [] =[];
  
  workUnits: Dropdown[] = [
    {value: 'DUMDUM', viewValue: 'Dum dum unit'},
    {value: 'SINGUR', viewValue: 'Singur Unit'}
  ];
  
  deliveryId : string;
  detailAmount : string;

  headerAmount : string;
  cgstAmount: string;
  sgstAmount: string;
  totalAmount : string;

  od : OrderDelivery = new OrderDelivery();

  consignees : Client[] = [];

  consigneeDetails : ClientDetails[] = [];

  suppliers : Client[] = [];
  supplierDetails : ClientDetails[] = [];

  rmName : string;
  unitId : string;
  unitName : string;
  rawMaterials : RawMaterial[] = [];

  siteId : string = 'SINGUR';
  isActive : boolean = true;

  constructor(private orderDeliveryService : OrderDeliveryService,
              private orderPlacementService : OrderPlacementService,
              private notificationService : NotificationService,
              private clientService : ClientService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private rawMaterialService : RawMaterialService
    ) { }

  ngOnInit(): void {
    this.getOrders();
    this.getConsignees();
    this.getSuppliers();
    this.getRawMaterials();
    
    this.deliveryForm = new FormGroup({
      'deliveryId': new FormControl(''),
      'billNo': new FormControl('', Validators.required),
      'billDate': new FormControl(null, Validators.required),
      'billDateString': new FormControl(''),
      //'orderId': new FormControl('', Validators.required),
      'supplierId' : new FormControl(''), 
      'supplierName' : new FormControl(''),
      'supplierIdentifier': new FormControl(''),
      'supplierDetailsId': new FormControl(''),
      'consigneeId': new FormControl(''),
      'consigneeName': new FormControl(''),
      'consigneeDetailsId': new FormControl(''),
      'consigneeIdentifier': new FormControl(''),
      'vehicleNo': new FormControl(''),
      'amount': new FormControl(null),
      'freightCharges': new FormControl(null),
      'cgstAmount': new FormControl(null),
      'sgstAmount': new FormControl(null),
      'totalAmount': new FormControl(null),
      'notes': new FormControl(''),
      'siteId': new FormControl(''),
      'isActive': new FormControl(true),
      'details': new FormControl(''),
      'projectId': new FormControl('')
    });

    this.deliveryDetailsForm = this.fb.group({
      'deliveryId': new FormControl(''),
      'detailId': new FormControl(''),
      'rmId': new FormControl('', Validators.required),
      'rmName': new FormControl(''),
      'unitId': new FormControl(''),
      'unitName': new FormControl('', Validators.required),
      'quantity': new FormControl(null, [Validators.required]),
      'rate': new FormControl(null),
      'amount': new FormControl(null),
      //'remainingQuantity': new FormControl(0),
      'oldQuantity' : new FormControl(null)
    }//,
    //{validator : lessThanValueValidator('quantity', 'remainingQuantity')}
    );

    this.route.queryParams.subscribe(param => {
      if (Object.keys(param).length > 0) {
        this.orderDeliveryService.findById(param.id).subscribe((order: OrderDelivery) => {
          this.details = order.details;
          order.billDate = convertToDate(order.billDateString);
          this.filterConsigneeDateils(order.consigneeId);
          this.deliveryId = order.deliveryId;
          this.deliveryForm.setValue(order); 
        })
      }
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.deliveryForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.deliveryDetailsForm.controls[controlName].hasError(errorName); 
  }

  onSubmit() {
    if (this.deliveryForm.valid) {
      this.orderDelivery = this.deliveryForm.value;
      this.orderDelivery.details = this.details;
      if(this.deliveryForm.value.isActive == null || this.deliveryForm.value.isActive == '') {
        this.orderDelivery.isActive = true;
      }
      if(this.deliveryForm.value.billDate != null) {
        this.orderDelivery.billDateString = this.datePipe.transform(this.orderDelivery.billDate, 'dd/MM/yyyy');
      }
      this.orderDeliveryService.save(this.orderDelivery).subscribe(
        (response: ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          console.log("success response ::");
          console.log(response);
          this.deliveryForm.reset();
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
    if (this.deliveryDetailsForm.valid) {
      let newDetail: OrderDeliveryDetails = this.deliveryDetailsForm.value;
      let deliveryId = newDetail.deliveryId;
      let index: number = -1;
      if (deliveryId != null && deliveryId.length > 0) {
        index = this.details.findIndex(detail => detail.deliveryId == deliveryId);
      } else {
        index = this.details.findIndex(detail => detail.rmId == newDetail.rmId);
      }
      console.log("last index >>" + index);
      if (index != -1) {
        this.details[index] = this.deliveryDetailsForm.value;
        this.notificationService.openSnackBar("Order details updated successfully", "success");
      } else {
        this.details.push(this.deliveryDetailsForm.value);
        this.notificationService.openSnackBar("Order details added successfully", "success");
      }
      this.deliveryDetailsForm.reset();
      this.headerAmount = this.calculateTotalDetailAmount();
      this.calculate(this.headerAmount);
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }

  close(frame : ModalDirective)  {
    frame.hide();
  }

  editDetail(orderDeliveryDetails: OrderDeliveryDetails, frame : ModalDirective) {
    /* if(orderDeliveryDetails.detailId != null && orderDeliveryDetails.detailId > 0) {
      orderDeliveryDetails.oldQuantity = orderDeliveryDetails.quantity;
    } */
    this.deliveryDetailsForm.patchValue(orderDeliveryDetails);
    frame.show();
  }

  openDialog(orderDeliveryDetails: OrderDeliveryDetails): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDetail(orderDeliveryDetails);
      }
    });
  }

  deleteDetail(orderDeliveryDetails: OrderDeliveryDetails) {
    let index = this.calculateDetailIndex(orderDeliveryDetails);
    if (orderDeliveryDetails.detailId) {
      this.orderDeliveryService.deleteDetail(orderDeliveryDetails.deliveryId, orderDeliveryDetails.detailId)
      .subscribe((response: ServerResponse) => {
        this.details.splice(index, 1);
        this.notificationService.openSnackBar(response.message, response.status);
      }, (errorMsg: HttpErrorResponse) => {
        this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
        console.log("error response ::");
        console.log(errorMsg.message);
      });
    } else {
      if (index !== -1) {
        this.details.splice(index, 1);
        this.notificationService.openSnackBar("Order details removed successfully", "success");
      }
    }
  }

  calculateDetailIndex(orderDeliveryDetails: OrderDeliveryDetails): number {
    let index: number = -1;
    if (orderDeliveryDetails.detailId != null) {
      index = this.details.findIndex(detail => detail.detailId == orderDeliveryDetails.detailId);
    } else {
      index = this.details.findIndex(detail => detail.rmId == orderDeliveryDetails.rmId);
    }
    return index;
  }

  calculateDetail() {
    let quantity = this.deliveryDetailsForm.value.quantity;
    let rate = this.deliveryDetailsForm.value.rate;

    if(isNumeric(quantity) && isNumeric(rate) ) {
      this.detailAmount = (Number.parseFloat(rate.toString()) * Number.parseFloat(quantity.toString())).toFixed(2);
    }
  }

  getOrders() {
    this.orderPlacementService.findAll().subscribe(
      orders => {
        this.orders = orders;
      }
    );
  }


  populatOrder(event : MatSelectChange) {
    let val = event.value;
    let orderPlacement : OrderPlacement = this.orders.filter(s => s.orderId === val)[0];
    this.populateOrderDelivery(orderPlacement);
  }

  populateOrderDelivery(op : OrderPlacement) {

    this.details = [];
    this.od.supplierId = op.supplierId;
    this.od.supplierName = op.supplierName;
    this.od.supplierDetailsId = op.supplierDetailsId;
    this.od.supplierIdentifier = op.identifier;
    this.od.siteId = op.siteId;
    this.od.projectId = op.projectId;
   
    let opDetails : OrderPlacementDetails [] = op.details;
    opDetails.forEach(d => {
      let dtl : OrderDeliveryDetails = new OrderDeliveryDetails();
      dtl.rmId = d.rmId;
      dtl.rmName = d.rmName;
      dtl.unitId = d.unitId;
      dtl.unitName = d.unitName;
      dtl.quantity = d.quantity;
      // if(d.alreadyOrderedQuantity != null) {
      //   dtl.remainingQuantity = d.quantity - d.alreadyOrderedQuantity;
      // }else {
      //   dtl.remainingQuantity = d.quantity;
      // }
     
      dtl.rate = d.rate;
      dtl.amount = Number.parseFloat(dtl.quantity.toString()) * Number.parseFloat(d.rate.toString());

      this.details.push(dtl);
    });
    this.headerAmount = this.calculateTotalDetailAmount();
    this.calculate(this.headerAmount);
  }

  calculateTotalDetailAmount() : string {
    let sum = this.details.map(d => d.amount).reduce((p, n) => Number.parseFloat(p.toString()) + Number.parseFloat(n.toString()), 0.0);
    return Number.parseFloat(sum.toString()).toFixed(2);
  }

  getConsignees() {
    this.clientService.findAll().subscribe(
      consignees => {
        this.consignees = consignees;
      }
    );
  }

  populateConsigneeDetails(event : MatSelectChange) { 
    let val = event.value;
    this.filterConsigneeDateils(val);
  }

  filterConsigneeDateils(clientId : string) {
    if(clientId != '') {
      this.consigneeDetails = this.consignees.filter(s => s.clientId === clientId)[0].details; 
    } 
  }

  calculateHeader() {
    let amount = this.deliveryForm.value.amount;
    this.calculate(amount);

  }

  calculate(amount : string) {
    let freightCharges = this.deliveryForm.value.freightCharges;

    let totalAmountWithOutGst: number = 0;
    if(isNumeric(amount) ) {
      totalAmountWithOutGst = totalAmountWithOutGst + Number.parseFloat(amount.toString());
    }
    if(isNumeric(freightCharges) ) {
      totalAmountWithOutGst = totalAmountWithOutGst + Number.parseFloat(freightCharges.toString());
    }

    this.cgstAmount = ((totalAmountWithOutGst * 9) / 100).toFixed(2);
    this.sgstAmount = ((totalAmountWithOutGst * 9) / 100).toFixed(2);

    this.totalAmount = (totalAmountWithOutGst + Number.parseFloat(this.cgstAmount) + Number.parseFloat(this.sgstAmount)).toFixed(2);
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

  getSuppliers() {
    this.clientService.findAll().subscribe(
      suppliers => {
        this.suppliers = suppliers;
      }
    );
  }


  populateSupplierDetails(event : MatSelectChange) { 
    let val = event.value;
    this.filterSupplierDateils(val);
  }

  filterSupplierDateils(clientId : String) {
    this.supplierDetails = this.suppliers.filter(s => s.clientId === clientId)[0].details; 
  }

  populateUnit(material : RawMaterial) {
    this.rmName = material.name;
    this.unitId = material.unit.unitId;
    this.unitName = material.unit.unitName;
  }

  getRawMaterials() {
    this.rawMaterialService.findAllRawMaterials().subscribe(
      rawMaterials => {
        this.rawMaterials = rawMaterials;
      }
    );
  }
}
