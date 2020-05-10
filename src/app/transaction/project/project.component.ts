import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from './project';
import { ProjectDetails } from './project-details';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ProjectService } from './project.service';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'angular-bootstrap-md';
import { RawMaterialService } from 'src/app/admin/raw-material/raw-material.service';
import { ClientService } from 'src/app/admin/client/client.service';
import { UnitService } from 'src/app/admin/unit/unit.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RawMaterial } from 'src/app/admin/raw-material/raw-material';
import { Client } from 'src/app/admin/client/client';
import { Unit } from 'src/app/admin/unit/unit';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { isNumeric } from 'rxjs/util/isNumeric';

declare const $: any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projectForm: FormGroup;

  projectDetailForm: FormGroup;

  project : Project;

  details : ProjectDetails[] =[];

  rawMaterials : RawMaterial[] = [];

  customers : Client[] = [];

  consignees : Client[] = [];

  units : Unit[] =[];

  unitId : string;
  unitName : string;

  projectId : string;
  amendmentNo : number;
  amendmentDate: Date;

  headerAmount : string;
  cgstAmount: string;
  sgstAmount: string;
  totalAmount : string;

   detailAmount : string;

  statusValues: Dropdown[] = [
    {value: 'draft', viewValue: 'Draft'},
    {value: 'in_progress', viewValue: 'In Progress'},
    {value: 'complete', viewValue: 'Complete'}
  ];
  
  constructor(private projectService : ProjectService,
              private notificationService : NotificationService,
              private rawMaterialService : RawMaterialService,
              private clientService : ClientService,
              private unitService : UnitService,
              public dialog: MatDialog,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.getCustomers();
    this.getConsignees();
    this.findAllProducts();

    this.projectForm = new FormGroup({
      'projectId': new FormControl(''),
      'amendmentNo': new FormControl(''),
      'amendmentDate': new FormControl(null),
      'description' : new FormControl('', Validators.required),
      'customerId': new FormControl('', Validators.required),
      'customerName': new FormControl(''),
      'consigneeId': new FormControl(''),
      'consigneeName': new FormControl(''),
      'projectStartDate': new FormControl(null),
      'projectStartDateString': new FormControl(''),
      'purchaseOrderNo': new FormControl(''),
      'purchaseOrderDate': new FormControl(null),
      'purchaseOrderDateString' : new FormControl(''),
      'workOrderReference' : new FormControl(''),
      'expectedDeliveryDate': new FormControl(null, Validators.required),
      'actualDeliveryDate': new FormControl(null),
      'expectedDeliveryDateString': new FormControl(''),
      'actualDeliveryDateString': new FormControl(''),
      'status': new FormControl('', Validators.required),
      'amount': new FormControl(0),
      'otherCharges': new FormControl(0),
      'cgstAmount': new FormControl(0),
      'sgstAmount': new FormControl(0),
      'totalAmount': new FormControl(0),
      'isActive': new FormControl(''),
      'details': new FormControl(''),
      'amendmentDateString': new FormControl(''),
      'notes': new FormControl('') 
      
    });

    this.projectDetailForm = new FormGroup({
      'projectId': new FormControl(''),
      'amendmentNo': new FormControl(''),
      'detailId': new FormControl(''),
      'rmId': new FormControl('', Validators.required),
      'rmName': new FormControl(''),
      'unitId': new FormControl(''),
      'unitName': new FormControl('', Validators.required),
      'quantity': new FormControl(0, Validators.required),
      'rate': new FormControl(0),
      'amount': new FormControl(0)
    });

    this.route.queryParams.subscribe(param => {
      if (Object.keys(param).length > 0) {
        this.projectService.findById(param.id, param.amendmentNo).subscribe((project: Project) => {
          this.details = project.details;
          project.expectedDeliveryDate = this.convertToDate(project.expectedDeliveryDateString);
          project.actualDeliveryDate = this.convertToDate(project.actualDeliveryDateString);
          project.amendmentDate = this.convertToDate(project.amendmentDateString);
          project.projectStartDate = this.convertToDate(project.projectStartDateString);
          project.purchaseOrderDate = this.convertToDate(project.purchaseOrderDateString);
          this.projectForm.setValue(project); 
          this.projectId = project.projectId;
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
    return this.projectForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.projectDetailForm.controls[controlName].hasError(errorName); 
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.project = this.projectForm.value;
      this.project.details = this.details;
      if(this.projectForm.value.isActive == null || this.projectForm.value.isActive == '') {
        this.project.isActive = true;
      }
      this.project.expectedDeliveryDateString = this.project.expectedDeliveryDate.toLocaleDateString();
      if(this.projectForm.value.actualDeliveryDate != null) {
        this.project.actualDeliveryDateString = this.project.actualDeliveryDate.toLocaleDateString();
      }
      if(this.projectForm.value.purchaseOrderDate != null) {
        this.project.purchaseOrderDateString = this.project.purchaseOrderDate.toLocaleDateString();
      }
      if(this.projectForm.value.projectStartDate != null) {
        this.project.projectStartDateString = this.project.projectStartDate.toLocaleDateString();
      }

      if(this.projectForm.value.amendmentDate == null) {
        this.project.amendmentDateString = (new Date()).toLocaleDateString();
        this.project.amendmentNo = 0;
      } else {
        this.project.amendmentDateString = this.project.amendmentDate.toLocaleDateString();
      }

      this.projectService.save(this.project).subscribe(
        (response: ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          console.log("success response ::");
          console.log(response);
          this.projectForm.reset();
          this.details = [];
        },
        (errorMsg: HttpErrorResponse) => {
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log("error response ::");
          console.log(errorMsg.message);
        }
      );
    }
    console.log(this.projectForm.value);
  }

  onDetailSubmit(frame : ModalDirective) {
    if (this.projectDetailForm.valid) {
      let newDetail: ProjectDetails = this.projectDetailForm.value;
      let projectId = newDetail.projectId;
      let index: number = -1;
      if (projectId != null && projectId.length > 0) {
        index = this.details.findIndex(detail => detail.projectId == projectId);
      } else {
        index = this.details.findIndex(detail => detail.rmId == newDetail.rmId);
      }
      console.log("last index >>" + index);
      if (index != -1) {
        this.details[index] = this.projectDetailForm.value;
        this.notificationService.openSnackBar("Project details updated successfully", "success"); 
      } else {
        this.details.push(this.projectDetailForm.value);
        this.notificationService.openSnackBar("Project details added successfully", "success");
      }
      this.calculateTotalDetailAmount();
      this.projectDetailForm.reset();
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }

  calculateTotalDetailAmount() {
    let sum = this.details.map(d => d.amount).reduce((p, n) => Number.parseFloat(p.toString()) + Number.parseFloat(n.toString()), 0.0);
    this.headerAmount = Number.parseFloat(sum.toString()).toFixed(2);
    this.calculateFromGrid();
  }

  findAllProducts() {
    this.rawMaterialService.findAllProducts().subscribe(
      rawMaterials => {
        this.rawMaterials = rawMaterials;
      }
    );
  }

  getCustomers() {
    this.clientService.findAll().subscribe(
      customers => {
        this.customers = customers;
      }
    );
  }

  getConsignees() {
    this.clientService.findAll().subscribe(
      consignees => {
        this.consignees = consignees;
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

  editDetail(projectDetail: ProjectDetails, frame : ModalDirective) {
    this.projectDetailForm.setValue(projectDetail);
    frame.show();
  }

  openDialog(projectDetail : ProjectDetails): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDetail(projectDetail);
      }
    });
  }

  deleteDetail(projectDetail: ProjectDetails) {
    let index = this.calculateDetailIndex(projectDetail);
    if (projectDetail.projectId) {
      this.projectService.deleteDetail(projectDetail.projectId, projectDetail.amendmentNo, projectDetail.detailId)
      .subscribe((response: ServerResponse) => {
        this.details.splice(index, 1);
        this.calculateTotalDetailAmount();
        this.notificationService.openSnackBar(response.message, response.status);
      }, (errorMsg: HttpErrorResponse) => {
        this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
        console.log("error response ::");
        console.log(errorMsg.message);
      });
    } else {
      if (index !== -1) {
        this.details.splice(index, 1);
        this.calculateTotalDetailAmount();
        this.notificationService.openSnackBar("Order details removed successfully", "success");
      }
    }
  }

  calculateDetailIndex(projectDetail: ProjectDetails): number {
    let index: number = -1;
    if (projectDetail.projectId != null && projectDetail.projectId.length > 0) {
      index = this.details.findIndex(detail => detail.projectId == projectDetail.projectId);
    } else {
      index = this.details.findIndex(detail => detail.rmId == projectDetail.rmId);
    }
    return index;
  }

  calculateHeader() {
    let amount = this.projectForm.value.amount;
    this.calculate(amount);

  }

  calculateFromGrid() {
    let amount = this.headerAmount;
    this.calculate(amount);

  }
  
  calculate(amount : string) {
    let otherCharges = this.projectForm.value.otherCharges;

    let totalAmountWithOutGst: number = 0;
    if(isNumeric(amount) ) {
      totalAmountWithOutGst = totalAmountWithOutGst + Number.parseFloat(amount.toString());
    }
    if(isNumeric(otherCharges) ) {
      totalAmountWithOutGst = totalAmountWithOutGst + Number.parseFloat(otherCharges.toString());
    }

    this.cgstAmount = ((totalAmountWithOutGst * 9) / 100).toFixed(2);
    this.sgstAmount = ((totalAmountWithOutGst * 9) / 100).toFixed(2);

    this.totalAmount = (totalAmountWithOutGst + Number.parseFloat(this.cgstAmount) + Number.parseFloat(this.sgstAmount)).toFixed(2);

  }

  calculateDetail() {
    let quantity = this.projectDetailForm.value.quantity;
    let rate = this.projectDetailForm.value.rate;

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

}

