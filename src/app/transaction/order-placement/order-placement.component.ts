import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { isNumeric } from 'rxjs/util/isNumeric';
import { Client } from 'src/app/admin/client/client';
import { ClientDetails } from 'src/app/admin/client/client-detail';
import { ClientService } from 'src/app/admin/client/client.service';
import { RawMaterial } from 'src/app/admin/raw-material/raw-material';
import { RawMaterialService } from 'src/app/admin/raw-material/raw-material.service';
import { Unit } from 'src/app/admin/unit/unit';
import { UnitService } from 'src/app/admin/unit/unit.service';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { OrderPlacement } from './order-placement';
import { OrderPlacementDetails } from './order-placement-details';
import { OrderPlacementService } from './order-placement.service';
import { DatePipe } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-order-placement',
  templateUrl: './order-placement.component.html',
  styleUrls: ['./order-placement.component.css']
})
export class OrderPlacementComponent implements OnInit {

  opForm: FormGroup;

  opDetailForm: FormGroup;

  orderPlacement : OrderPlacement;

  details : OrderPlacementDetails[] =[];
  
  displayedColumns = ['rmId', 'quantity', 'unitId'];

  rawMaterials : RawMaterial[] = [];

  suppliers : Client[] = [];

  projects : Project[] = [];

  units : Unit[] =[];

  supplierDetails : ClientDetails[] = [];

  rmName : string;
  unitId : string;
  unitName : string;

  orderId : string;

  detailAmount : string;

  statusValues: Dropdown[] = [
    {value: 'draft', viewValue: 'Draft'},
    {value: 'in_progress', viewValue: 'In Progress'},
    {value: 'submit', viewValue: 'Submit'}
  ];

  workUnits: Dropdown[] = [
    {value: 'DUMDUM', viewValue: 'Dum dum unit'},
    {value: 'SINGUR', viewValue: 'Singur Unit'}
  ];

  freightCharges: Dropdown[] = [
    {value: 'Inclusive', viewValue: 'Inclusive'},
    {value: 'Exclisive', viewValue: 'Exclisive'}
  ];

  constructor(private orderPlacementService : OrderPlacementService,
              private notificationService : NotificationService,
              private rawMaterialService : RawMaterialService,
              private clientService : ClientService,
              private projectService : ProjectService,
              private unitService : UnitService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private datePipe: DatePipe) { 
  }
  

  ngOnInit(): void {

    this.getRawMaterials();
    this.getSuppliers();
    this.getProjects();
    this.getUnits();

    this.opForm = new FormGroup({
      'orderId': new FormControl(''),
      'supplierId': new FormControl(''),
      'supplierDetailsId': new FormControl(''),
      'expectedDeliveryDate': new FormControl(null, Validators.required),
      'status': new FormControl('', Validators.required),
      'notes': new FormControl(''),
      'projectId' : new FormControl('', Validators.required),
      'description' : new FormControl(''),
      'identifier': new FormControl(''),
      'siteId': new FormControl('', Validators.required),
      'details': new FormControl(''),
      'expectedDeliveryDateString': new FormControl(''),
      'isActive': new FormControl(''),
      'supplierName': new FormControl(''),
      'orderDate': new FormControl(new Date(), Validators.required),
      'orderDateString': new FormControl(''),
      'freightChargeType': new FormControl(''),
      'paymentTerms': new FormControl('Against Delivery else @ 18% interest from the date of delivery', Validators.required)
    });

    this.opDetailForm = new FormGroup({
      'orderId': new FormControl(''),
      'orderDetailsId': new FormControl(''),
      'rmId': new FormControl('', Validators.required),
      'rmName': new FormControl(''),
      'unitId': new FormControl(''),
      'unitName': new FormControl('', Validators.required),
      'quantity': new FormControl(0, Validators.required),
      'rate': new FormControl(0, Validators.required) ,
      'amount': new FormControl(0, Validators.required),
      'alreadyOrderedQuantity': new FormControl(null),
      'remainingQuantity': new FormControl(null),
    });

    this.route.queryParams.subscribe(param => {
      if (Object.keys(param).length > 0) {
        this.orderPlacementService.findById(param.id).subscribe((order: OrderPlacement) => {
          this.details = order.details;
          order.expectedDeliveryDate = this.convertToDate(order.expectedDeliveryDateString);
          order.orderDate = this.convertToDate(order.orderDateString);
          this.filterSupplierDateils(order.supplierId);
          this.opForm.setValue(order); 
          this.orderId = order.orderId;
        })
      }
    });
  }

  convertToDate(dt : string) : Date {
    let d : Date = null;
    if(dt!= null && dt.length > 0) {
      d =  new Date(dt);
    }
    return d;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.opForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.opDetailForm.controls[controlName].hasError(errorName); 
  }

  

  onSubmit() {
    if (this.opForm.valid) {
      this.orderPlacement = this.opForm.value;
      this.orderPlacement.details = this.details;
      if(this.opForm.value.isActive == null || this.opForm.value.isActive == '') {
        this.orderPlacement.isActive = true;
      }
      this.orderPlacement.expectedDeliveryDateString = this.datePipe.transform(this.orderPlacement.expectedDeliveryDate, 'dd/MM/yyyy');
      this.orderPlacement.orderDateString = this.datePipe.transform(this.orderPlacement.orderDate, 'dd/MM/yyyy');
      this.orderPlacementService.save(this.orderPlacement).subscribe(
        (response: ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          console.log("success response ::");
          console.log(response);
          this.opForm.reset();
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
    if (this.opDetailForm.valid) {
      let newDetail: OrderPlacementDetails = this.opDetailForm.value;
      let orderId = newDetail.orderId;
      let index: number = -1;
      if (orderId != null && orderId.length > 0) {
        index = this.details.findIndex(detail => detail.orderId == orderId);
      } else {
        index = this.details.findIndex(detail => detail.rmId == newDetail.rmId);
      }
      console.log("last index >>" + index);
      if (index != -1) {
        this.details[index] = this.opDetailForm.value;
        this.notificationService.openSnackBar("Log updated successfully", "success");
      } else {
        this.details.push(this.opDetailForm.value);
        this.notificationService.openSnackBar("Log added successfully", "success");
      }
      this.opDetailForm.reset();
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }

  getRawMaterials() {
    this.rawMaterialService.findAllRawMaterials().subscribe(
      rawMaterials => {
        this.rawMaterials = rawMaterials;
      }
    );
  }

  getSuppliers() {
    this.clientService.findAll().subscribe(
      suppliers => {
        this.suppliers = suppliers;
      }
    );
  }

  getProjects() {
    this.projectService.findAll().subscribe(
      projects => {
        this.projects = projects;
      }
    );
  }

  getUnits() {
    this.unitService.getAllUnits().subscribe(
      units => {
        this.units = units;
      }
    );
  }

  close(frame : ModalDirective )  {
    frame.hide();
  }

  populateUnit(material : RawMaterial) {
    this.rmName = material.name;
    this.unitId = material.unit.unitId;
    this.unitName = material.unit.unitName;
  }

  editDetail(orderPlacementDetail: OrderPlacementDetails, frame : ModalDirective) {
    this.opDetailForm.setValue(orderPlacementDetail);
    frame.show();
  }

  openDialog(orderPlacementDetail: OrderPlacementDetails): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDetail(orderPlacementDetail);
      }
    });
  }

  deleteDetail(orderPlacementDetail: OrderPlacementDetails) {
    let index = this.calculateDetailIndex(orderPlacementDetail);
    if (orderPlacementDetail.orderId) {
      this.orderPlacementService.deleteDetail(orderPlacementDetail.orderId, orderPlacementDetail.orderDetailsId)
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

  calculateDetailIndex(orderPlacementDetail: OrderPlacementDetails): number {
    let index: number = -1;
    if (orderPlacementDetail.orderId != null && orderPlacementDetail.orderId.length > 0) {
      index = this.details.findIndex(detail => detail.orderId == orderPlacementDetail.orderId);
    } else {
      index = this.details.findIndex(detail => detail.rmId == orderPlacementDetail.rmId);
    }
    return index;
  }

  populateSupplierDetails(event : MatSelectChange) { 
    let val = event.value;
    this.filterSupplierDateils(val);
  }

  filterSupplierDateils(clientId : String) {
    this.supplierDetails = this.suppliers.filter(s => s.clientId === clientId)[0].details; 
  }

  calculateDetail() {
    let quantity = this.opDetailForm.value.quantity;
    let rate = this.opDetailForm.value.rate;

    if(isNumeric(quantity) && isNumeric(rate) ) {
      this.detailAmount = (Number.parseFloat(rate.toString()) * Number.parseFloat(quantity.toString())).toFixed(2);
    }

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
}
