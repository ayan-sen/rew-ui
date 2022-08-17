import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { RawMaterial } from './raw-material';
import { RawMaterialService } from './raw-material.service';
import { UnitService } from '../unit/unit.service';
import { Unit } from '../unit/unit';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';

declare const $: any;

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.css']
})
export class RawMaterialComponent implements OnInit {

  rawMaterial : RawMaterial;
  rmForm: FormGroup;
  rawMaterials : RawMaterial[];
  units : Unit[];
  isActive : boolean = true;
  
  activeValues: Dropdown[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'}
  ];
 
  types: Dropdown[] = [
    {value: "R", viewValue: 'Raw Material'},
    {value: "P", viewValue: 'Product'},
    {value: "S", viewValue: 'Semi-finished Product'}
  ];

  constructor(private rawMaterialService : RawMaterialService, 
              private notificationService : NotificationService,
              private unitService : UnitService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllUnits();
    this.findAll();
    this.rmForm = new FormGroup({
      'code': new FormControl(''),
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'hsnSacCode': new FormControl('', Validators.required), 
      'unitId': new FormControl('', Validators.required),
      'unitName': new FormControl(''),
      'isActive': new FormControl(''),
      'type': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if(this.rmForm.valid) {
      this.rawMaterial = this.rmForm.value;
      console.log(this.rawMaterial);
      this.rawMaterialService.save(this.rawMaterial).subscribe(
        (response:ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          this.findAll();
          this.rmForm.reset();
        }, (errorMsg: HttpErrorResponse) => { 
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log("error response ::");
          console.log(errorMsg.message);
        }
      );
    }
  }
 
  findAll() {
    this.rawMaterialService.findAll().subscribe(
      rawMaterials => {
        this.rawMaterials = rawMaterials;
      }
    );
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.rmForm.controls[controlName].hasError(errorName); 
  }

  getAllUnits() {
    this.unitService.getAllUnits().subscribe(
      units => {
        this.units = units;
      }
    );
  }

  delete(material : RawMaterial) {
    this.rawMaterialService.delete(material.code).subscribe(
      (response : ServerResponse) => {
        console.log("Delete Response >>>>");
        console.log(response);
        this.notificationService.openSnackBar(response.message, response.status);
        this.findAll();
    });
  }

  openDialog(material : RawMaterial): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.delete(material);
      }
    });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  edit(material : RawMaterial) {
    this.rmForm.setValue(material);
  }
}
