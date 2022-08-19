import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { isNumeric } from 'rxjs/internal-compatibility';
import { RawMaterial } from 'src/app/admin/raw-material/raw-material';
import { RawMaterialService } from 'src/app/admin/raw-material/raw-material.service';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { convertToDate } from 'src/app/components/common-service/common-uutil';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { InvoiceService } from '../invoice.service';
import { ProjectMaterial } from '../order-processing/project-material';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { Invoice } from './invoice';
import { InvoiceDetails } from './invoice-details';

declare const $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoiceForm: FormGroup;

  invoiceDetailsForm: FormGroup;

  invoice : Invoice;
 
  details : InvoiceDetails[] = [];

  invoiceId : string;
  invoiceDetailsId : string;
  detailAmount : string;

  headerAmount : string;
  cgstAmount: string;
  sgstAmount: string;
  totalAmount : string;

  inv : Invoice = new Invoice();

  rmName : string;
  unitId : string;
  unitName : string;
  rawMaterials : RawMaterial[] = [];
  filteredRawMaterialIds : string[] =[];

  filteredRawMaterials : RawMaterial[] = [];
  projects : Project[] = [];

  isActive : boolean = true;

  projectMaterialList : ProjectMaterial[] = [];

  paymentStatusValues: Dropdown[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'}
  ];

  availableQuantity : number;
  materialUnitName : string;
  materialUnit : string;
  materialId : string;
  materialName : string;
  materialType : string; 
  isPaymentDone : boolean;
  rate : number;
  amount : string;

  constructor(private invoiceService : InvoiceService,
              private projectService : ProjectService,
              private notificationService : NotificationService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private rawMaterialService : RawMaterialService
    ) { }

    ngOnInit(): void {
      this.getProjects();
      this.invoiceForm = new FormGroup({
        'invoiceId': new FormControl(''),
        'invoiceDate': new FormControl(null, Validators.required),
        'invoiceDateString': new FormControl(''),
        'projectId' : new FormControl('', Validators.required),
        'vehicleNo': new FormControl('', Validators.required),
        'isPaymentDone': new FormControl(null),
        'amount': new FormControl(null),
        'freightCharges': new FormControl(null),
        'cgstAmount': new FormControl(null),
        'sgstAmount': new FormControl(null),
        'totalAmount': new FormControl(null),
        'notes' : new FormControl(''),
        'details': new FormControl('')
        
      });
      
      this.invoiceDetailsForm = new FormGroup({
        'invoiceId': new FormControl(''),
        'invoiceDetailsId': new FormControl(''),
        'materialId': new FormControl('', Validators.required),
        'materialName': new FormControl(''),
        'materialUnit': new FormControl(''),
        'materialUnitName': new FormControl('', Validators.required),
        'quantity': new FormControl(0, Validators.required),
        'rate': new FormControl(0, Validators.required) ,
        'amount': new FormControl(0, Validators.required),
        'availableQuantity': new FormControl(null)
      });
  
      this.route.queryParams.subscribe(param => {
        if (Object.keys(param).length > 0) {
          this.invoiceService.findById(param.id).subscribe((invoice: Invoice) => {
            this.details = invoice.details;
            invoice.invoiceDate = convertToDate(invoice.invoiceDateString);
            this.invoiceForm.setValue(invoice); 
            this.invoiceId = invoice.invoiceId;
            this.populateDetails(invoice.projectId);
          })
        }
      });
    }

    public hasError = (controlName: string, errorName: string) =>{
      return this.invoiceForm.controls[controlName].hasError(errorName); 
    }
  
    public hasDetailError = (controlName: string, errorName: string) =>{
      return this.invoiceDetailsForm.controls[controlName].hasError(errorName); 
    }

    onSubmit() {
      if (this.invoiceForm.valid) {
        this.invoice = this.invoiceForm.value;
        this.invoice.details = this.details;
        
        if(this.invoiceForm.value.invoiceDate != null) {
          this.invoice.invoiceDateString = this.datePipe.transform(this.invoice.invoiceDate, 'dd/MM/yyyy');
        }
        this.invoiceService.save(this.invoice).subscribe(
          (response: ServerResponse) => {
            this.notificationService.openSnackBar(response.message, response.status);
            console.log("success response ::");
            console.log(response);
            this.invoiceForm.reset();
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
      if (this.invoiceDetailsForm.valid) {
        let newDetail: InvoiceDetails = this.invoiceDetailsForm.value;
        let detailId = newDetail.invoiceDetailsId;
        let index: number = -1;
        if (detailId != null ) {
          index = this.details.findIndex(detail => detail.invoiceDetailsId == detailId);
        } else {
          index = this.details.findIndex(detail => detail.materialId == newDetail.materialId);
        }
        console.log("last index >>" + index);
        if (index != -1) {
          this.details[index] = this.invoiceDetailsForm.value;
          this.notificationService.openSnackBar("Order details updated successfully", "success");
        } else {
          this.details.push(this.invoiceDetailsForm.value);
          this.notificationService.openSnackBar("Order details added successfully", "success");
        }
        this.invoiceDetailsForm.reset();
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
  
    editDetail(invoiceDetails: InvoiceDetails, frame : ModalDirective) {
      let pm : ProjectMaterial = this.projectMaterialList.filter(d => d.code == invoiceDetails.materialId)[0];
      this.availableQuantity = pm.availableQuantity;
      this.invoiceDetailsForm.patchValue(invoiceDetails);
      frame.show();
    }
  

    openDialog(invoiceDetails: InvoiceDetails): void {
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '250px',
        data: { header : "Confirm",
                content : "Are you sure to delete?" 
              }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.deleteDetail(invoiceDetails);
        }
      });
    }
  
    deleteDetail(invoiceDetails: InvoiceDetails) {
      let index = this.calculateDetailIndex(invoiceDetails);
      if (invoiceDetails.invoiceDetailsId) {
        this.invoiceService.deleteDetail(invoiceDetails.invoiceId, invoiceDetails.invoiceDetailsId)
        .subscribe((response: ServerResponse) => {
          this.details.splice(index, 1);
          this.headerAmount = this.calculateTotalDetailAmount();
          this.calculate(this.headerAmount);
          this.notificationService.openSnackBar(response.message, response.status);
        }, (errorMsg: HttpErrorResponse) => {
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log("error response ::");
          console.log(errorMsg.message);
        });
      } else {
        if (index !== -1) {
          this.details.splice(index, 1);
          this.headerAmount = this.calculateTotalDetailAmount();
          this.calculate(this.headerAmount);
          this.notificationService.openSnackBar("Invoice details removed successfully", "success");
        }
      }
    }


    calculateDetailIndex(invoiceDetails: InvoiceDetails): number {
      let index: number = -1;
      if (invoiceDetails.invoiceDetailsId != null) {
        index = this.details.findIndex(detail => detail.invoiceDetailsId == invoiceDetails.invoiceDetailsId);
      } else {
        index = this.details.findIndex(detail => detail.materialId == invoiceDetails.materialId);
      }
      return index;
    }
  
    calculateTotalDetailAmount() : string {
      let sum = this.details.map(d => d.amount).reduce((p, n) => Number.parseFloat(p.toString()) + Number.parseFloat(n.toString()), 0.0);
      return Number.parseFloat(sum.toString()).toFixed(2);
    }

    calculateHeader() {
      let amount = this.invoiceForm.value.amount;
      this.calculate(amount);
  
    }
  
    calculate(amount : string) {
      let freightCharges = this.invoiceForm.value.freightCharges;
  
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
  


    getProjects() {
      this.projectService.findAll().subscribe(
        projects => {
          this.projects = projects;
        }
      );
    }

    populatDetailLists(event : MatSelectChange) {
      let projectId = event.value;
      this.populateDetails(projectId);
      this.invoiceDetailsForm.reset();
    }

    populateDetails(projectId : string) {
      this.invoiceService.findMaterialsByProjectIdAndSiteId(projectId)
          .subscribe(details=> {
            this.projectMaterialList = details;
            
      });
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
      this.rate = pm.rate;
     // this.amount = (Number.parseFloat(pm.rate.toString()) * Number.parseFloat(pm.quantity.toString())).toFixed(2);
      
    }

    calculateDetail() {
      let quantity = this.invoiceDetailsForm.value.quantity;
      let rate = this.invoiceDetailsForm.value.rate;
  
      if(isNumeric(quantity) && isNumeric(rate) ) {
        this.amount = (Number.parseFloat(rate.toString()) * Number.parseFloat(quantity.toString())).toFixed(2);
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
