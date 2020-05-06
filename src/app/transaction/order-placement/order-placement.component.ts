import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { OrderPlacement } from './order-placement';
import { OrderPlacementDetails } from './order-placement-details';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { RawMaterialService } from 'src/app/admin/raw-material/raw-material.service';
import { RawMaterial } from 'src/app/admin/raw-material/raw-material';
import { ClientService } from 'src/app/admin/client/client.service';
import { Client } from 'src/app/admin/client/client';
import { OrderPlacementService } from './order-placement.service';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { HttpErrorResponse } from '@angular/common/http';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/project';
import { Unit } from 'src/app/admin/unit/unit';
import { UnitService } from 'src/app/admin/unit/unit.service';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrderPlacementShowComponent } from './order-placement-show/order-placement-show.component';

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

  unitId : string;
  unitName : string;

  statusValues: Dropdown[] = [
    {value: 'draft', viewValue: 'Draft'},
    {value: 'in_progress', viewValue: 'In Progress'},
    {value: 'submit', viewValue: 'Submit'}
  ];

  workUnits: Dropdown[] = [
    {value: 'DUMDUM', viewValue: 'Dum dum unit'},
    {value: 'SINGUR', viewValue: 'Singur Unit'}
  ];

  constructor(private orderPlacementService : OrderPlacementService,
              private notificationService : NotificationService,
              private rawMaterialService : RawMaterialService,
              private clientService : ClientService,
              private projectService : ProjectService,
              private unitService : UnitService,
              public dialog: MatDialog,
              private route: ActivatedRoute) { 
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
      'actualDeliveryDate': new FormControl(null),
      'status': new FormControl('', Validators.required),
      'notes': new FormControl('', Validators.required),
      'projectId' : new FormControl('', Validators.required),
      'description' : new FormControl(''),
      'identifier': new FormControl(''),
      'siteId': new FormControl('', Validators.required),
      'details': new FormControl(''),
      'expectedDeliveryDateString': new FormControl(''),
      'actualDeliveryDateString': new FormControl(''),
      'isActive': new FormControl('')
    });

    this.opDetailForm = new FormGroup({
      'orderId': new FormControl(''),
      'orderDetailsId': new FormControl(''),
      'rmId': new FormControl('', Validators.required),
      'rmName': new FormControl(''),
      'unitId': new FormControl(''),
      'unitName': new FormControl('', Validators.required),
      'quantity': new FormControl(0, Validators.required) 
    });

    this.route.queryParams.subscribe(param => {
      this.orderPlacementService.findById(param.id).subscribe((order: OrderPlacement) => {
        this.details = order.details;
        order.expectedDeliveryDate = this.convertToDate(order.expectedDeliveryDateString);
        order.actualDeliveryDate = this.convertToDate(order.actualDeliveryDateString);
        this.opForm.setValue(order); 
      })
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
      this.orderPlacement.expectedDeliveryDateString = this.orderPlacement.expectedDeliveryDate.toLocaleDateString();
      this.orderPlacement.actualDeliveryDateString = this.orderPlacement.actualDeliveryDate.toLocaleDateString();
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
    }
    console.log(this.opForm.value);
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
        this.notificationService.openSnackBar("Order details updated successfully", "success");
      } else {
        this.details.push(this.opDetailForm.value);
        this.notificationService.openSnackBar("Order details added successfully", "success");
      }
      this.opDetailForm.reset();
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }

  getRawMaterials() {
    this.rawMaterialService.findAll().subscribe(
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
}