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
  
  activeValues: Dropdown[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'}
  ];

  constructor(private rawMaterialService : RawMaterialService, 
              private notificationService : NotificationService,
              private unitService : UnitService) { }

  ngOnInit(): void {
    this.getAllUnits();
    this.findAll();
    this.rmForm = new FormGroup({
      'code': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'unitId': new FormControl('', Validators.required),
      'isActive': new FormControl('', Validators.required)
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

}
