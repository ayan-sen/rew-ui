import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { mandatoryAndlessThanValueValidator } from 'src/app/components/common-commponents/validators/number-compare';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { convertToDate } from 'src/app/components/common-service/common-uutil';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { InventoryService } from '../inventory.service';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { OrderProcessing } from './order-processing';
import { OrderProcessingDetails } from './order-processing-details';
import { OrderProcessingService } from './order-processing.service';
import { ProjectMaterial } from './project-material';
import { DatePipe } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-order-processing',
  templateUrl: './order-processing.component.html',
  styleUrls: ['./order-processing.component.css']
})
export class OrderProcessingComponent implements OnInit {

  opForm: FormGroup;

  opDetailsForm: FormGroup;

  orderProcessing : OrderProcessing;

  materialId : string;
  materialName : string;
  materialType : string;
  materialUnit : string;
  materialUnitName : string;
  quantity : string;
  availableQuantity : number;
  remainingQuantity : number;
  processType : string;

  details : OrderProcessingDetails[] = [];

  projects : Project[] = [];

  projectMaterialList : ProjectMaterial[] =[];

  workUnits: Dropdown[] = [
    {value: 'DUMDUM', viewValue: 'Dum dum unit'},
    {value: 'SINGUR', viewValue: 'Singur Unit'}
  ];

  inOutValues: Dropdown[] = [
    {value: 'IN', viewValue: 'In'},
    {value: 'OUT', viewValue: 'Out'}
  ];
  
  siteId : string;

  constructor(private orderProcessingService : OrderProcessingService,
              private projectService : ProjectService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private notificationService : NotificationService,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getProjects();

    this.opForm = this.fb.group({
      'processId': new FormControl(null),
      'projectId': new FormControl('', Validators.required),
      'processDate': new FormControl(null, Validators.required),
      'processDateString': new FormControl(''),
      'notes': new FormControl(''),
      'siteId': new FormControl(''),
      'isActive': new FormControl(true),
      'details': new FormControl('')
    });
    this.opDetailsForm = this.fb.group({
      'processId': new FormControl(null),
      'processDetailsId': new FormControl(null),
      'processType': new FormControl('', Validators.required),
      'materialId': new FormControl('', Validators.required),
      'materialName': new FormControl(''),
      'materialUnit': new FormControl('', Validators.required),
      'materialUnitName': new FormControl(''),
      'quantity': new FormControl(null, Validators.required),
      'inOutFlag': new FormControl(''),
      'remainingQuantity': new FormControl(0),
      'availableQuantity' : new FormControl(0),
      'notes': new FormControl(''),
      'materialType': new FormControl(''),
    },
    {validator : [mandatoryAndlessThanValueValidator('quantity', 'availableQuantity','remainingQuantity', 'materialType', 'processType')]}
    );
    this.route.queryParams.subscribe(param => {
      if (Object.keys(param).length > 0) {
        this.orderProcessingService.findById(param.id).subscribe((orderProcessing : OrderProcessing) => {
          this.details = orderProcessing.details;
          orderProcessing.processDate = convertToDate(orderProcessing.processDateString);
          this.opForm.setValue(orderProcessing); 
        })
      }
    });
  }

  onSubmit() {
    if (this.opForm.valid) {
      this.orderProcessing = this.opForm.value;
      this.orderProcessing.details = this.details;
      if(this.opForm.value.isActive == null || this.opForm.value.isActive == '') {
        this.orderProcessing.isActive = true;
      }
      if(this.opForm.value.processDate != null) {
        this.orderProcessing.processDateString = this.datePipe.transform(this.orderProcessing.processDate, 'dd/MM/yyyy');
      }
      this.orderProcessingService.save(this.orderProcessing).subscribe(
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
    if (this.opDetailsForm.valid) {
      let newDetail: OrderProcessingDetails = this.opDetailsForm.value;
      let processId = newDetail.processId;
      let index: number = -1;
      if (processId != null && processId > 0) {
        index = this.details.findIndex(detail => detail.processId == processId);
      } else {
        index = this.details.findIndex(detail => detail.materialId == newDetail.materialId);
      }
      console.log("last index >>" + index);
      if (index != -1) {
        this.details[index] = this.opDetailsForm.value;
        this.notificationService.openSnackBar("Details updated successfully", "success");
      } else {
        this.details.push(this.opDetailsForm.value);
        this.notificationService.openSnackBar("Details added successfully", "success");
      }
      this.opDetailsForm.reset();
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }

  close(frame : ModalDirective)  {
    frame.hide();
  }

  editDetail(orderProcessingDetails: OrderProcessingDetails, frame : ModalDirective) {
    this.opDetailsForm.patchValue(orderProcessingDetails);
    frame.show();
  }

  openDialog(orderProcessingDetails: OrderProcessingDetails): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDetail(orderProcessingDetails);
      }
    });
  }

  deleteDetail(orderProcessingDetails: OrderProcessingDetails) {
    let index = this.calculateDetailIndex(orderProcessingDetails);
    if (orderProcessingDetails.processDetailsId) {
      this.orderProcessingService.deleteDetail(orderProcessingDetails.processId, orderProcessingDetails.processDetailsId)
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
        this.notificationService.openSnackBar("Details removed successfully", "success");
      }
    }
  }

  calculateDetailIndex(orderProcessingDetails: OrderProcessingDetails): number {
    let index: number = -1;
    if (orderProcessingDetails.processDetailsId != null) {
      index = this.details.findIndex(detail => detail.processDetailsId == orderProcessingDetails.processDetailsId);
    } else {
      index = this.details.findIndex(detail => detail.materialId == orderProcessingDetails.materialId);
    }
    return index;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.opForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.opDetailsForm.controls[controlName].hasError(errorName); 
  }

  getProjects() {
    this.projectService.findAll().subscribe(
      projects => {
        this.projects = projects;
      }
    );
  }

  populatDetailLists(event : MatSelectChange) {
    let projectId = event.value;
    this.orderProcessingService.findMaterialsByProjectIdAndSiteId(projectId, this.siteId)
        .subscribe(details=> {
          this.projectMaterialList = details;
    })
  }

  populateRow(event : MatSelectChange) {
    let matId = event.value;
    let pm : ProjectMaterial = this.projectMaterialList.filter(d => d.code == matId)[0];
    this.materialId = pm.code;
    this.materialName = pm.name;
    this.materialType = pm.type;
    this.materialUnit = pm.unitId;
    this.materialUnitName = pm.unitName;
    this.availableQuantity = pm.availableQuantity;
    this.remainingQuantity = pm.remainingQuantity;

    if(this.materialType == "P") {
      this.processType = "IN";
    }

    if(this.materialType == "R") {
      this.processType = "OUT"; 
    }
  }

  isProduct(matType : string) : boolean {
    return matType == "P";
  }
  
  isSemiProduct(matType : string) : boolean {
    return matType == "S";
  }

  isProductMat(mat : OrderProcessingDetails) : boolean {
    return mat.materialType == "P";
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
