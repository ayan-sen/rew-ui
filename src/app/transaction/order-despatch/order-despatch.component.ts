import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { convertToDate } from 'src/app/components/common-service/common-uutil';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { OrderDespatchService } from '../order-despatch.service';
import { ProjectMaterial } from '../order-processing/project-material';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { OrderDespatch } from './order-despatch';
import { OrderDespatchDetails } from './order-despatch-details';


declare const $: any;
@Component({
  selector: 'app-order-despatch',
  templateUrl: './order-despatch.component.html',
  styleUrls: ['./order-despatch.component.css']
})
export class OrderDespatchComponent implements OnInit {

  odForm : FormGroup;
  odDetailsForm : FormGroup;
  orderDespatch : OrderDespatch;

  materialId : string;
  materialName : string;
  materialType : string;
  materialUnit : string;
  materialUnitName : string;
  quantity : number;
  availableQuantity : number;
  despatchType : string;
  siteId : string;

  details : OrderDespatchDetails[] = [];

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
  
  
  
  constructor(private orderDespatchService : OrderDespatchService,
              private projectService : ProjectService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private notificationService : NotificationService,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getProjects();

    this.odForm = this.fb.group({
      'despatchId': new FormControl(null),
      'projectId': new FormControl('', Validators.required),
      'despatchDate': new FormControl(null, Validators.required),
      'despatchDateString': new FormControl(''),
      'notes': new FormControl(''),
      'siteId': new FormControl(''),
      'vehicleNo': new FormControl(''),
      'details': new FormControl('')
    });

    this.odDetailsForm = this.fb.group({
      'despatchId': new FormControl(null),
      'despatchDetailsId': new FormControl(null),
      'despatchType': new FormControl('', Validators.required),
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
    });

    this.route.queryParams.subscribe(param => {
      if (Object.keys(param).length > 0) {
        this.orderDespatchService.findById(param.id).subscribe((orderDespatch : OrderDespatch) => {
          this.details = orderDespatch.details;
          orderDespatch.despatchDate = convertToDate(orderDespatch.despatchDateString);
          this.odForm.setValue(orderDespatch); 
        })
      }
    });
  }

  onSubmit() {
    if (this.odForm.valid) {
      this.orderDespatch = this.odForm.value;
      this.orderDespatch.details = this.details;
      
      if(this.odForm.value.despatchDate != null) {
        this.orderDespatch.despatchDateString = this.datePipe.transform(this.orderDespatch.despatchDate, 'dd/MM/yyyy');
      }
      this.orderDespatchService.save(this.orderDespatch).subscribe(
        (response: ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          console.log("success response ::");
          console.log(response);
          this.odForm.reset();
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
    if (this.odDetailsForm.valid) {
      let newDetail: OrderDespatchDetails = this.odDetailsForm.value;
      let despatchId = newDetail.despatchId;
      let index: number = -1;
      if (despatchId != null && despatchId > 0) {
        index = this.details.findIndex(detail => detail.despatchId == despatchId);
      } else {
        index = this.details.findIndex(detail => detail.materialId == newDetail.materialId);
      }
      console.log("last index >>" + index);
      if (index != -1) {
        this.details[index] = this.odDetailsForm.value;
        this.notificationService.openSnackBar("Details updated successfully", "success");
      } else {
        this.details.push(this.odDetailsForm.value);
        this.notificationService.openSnackBar("Details added successfully", "success");
      }
      this.odDetailsForm.reset();
      frame.hide();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
  }

  close(frame : ModalDirective)  {
    this.odDetailsForm.reset();
    frame.hide();
  }


  editDetail(orderDespatchDetails: OrderDespatchDetails, frame : ModalDirective) {
    this.odDetailsForm.setValue(orderDespatchDetails);
    this.availableQuantity = orderDespatchDetails.availableQuantity;
    frame.show();
  }

  openDialog(orderDespatchDetails: OrderDespatchDetails): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDetail(orderDespatchDetails);
      }
    });
  }

  deleteDetail(orderDespatchDetails: OrderDespatchDetails) {
    let index = this.calculateDetailIndex(orderDespatchDetails);
    if (orderDespatchDetails.despatchDetailsId) {
      this.orderDespatchService.deleteDetail(orderDespatchDetails.despatchId, orderDespatchDetails.despatchDetailsId)
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

  calculateDetailIndex(orderDespatchDetails: OrderDespatchDetails): number {
    let index: number = -1;
    if (orderDespatchDetails.despatchDetailsId != null) {
      index = this.details.findIndex(detail => detail.despatchDetailsId == orderDespatchDetails.despatchDetailsId);
    } else {
      index = this.details.findIndex(detail => detail.materialId == orderDespatchDetails.materialId);
    }
    return index;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.odForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.odDetailsForm.controls[controlName].hasError(errorName); 
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
    this.orderDespatchService.findMaterialsByProjectIdAndSiteId(projectId, this.siteId)
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
    this.despatchType = "OUT"; 
  }


  isProduct(matType : string) : boolean {
    return matType == "P";
  }
  
  isSemiProduct(matType : string) : boolean {
    return matType == "S";
  }

  isProductMat(mat : OrderDespatchDetails) : boolean {
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
