import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unit } from './unit';
import { UnitService } from './unit.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  unitForm: FormGroup;

  unit : Unit;

  units : Unit[];

  constructor(private unitService : UnitService, private notificationService : NotificationService) { }

  ngOnInit(): void {
     this.unitForm = new FormGroup({
      'unitId': new FormControl('', Validators.required),
      'unitName': new FormControl('', Validators.required)
    });

    this.getAllUnits();
  }
  
  onSubmit() {
    if(this.unitForm.valid) {
      this.unit = this.unitForm.value;
      console.log(this.unit);
      this.unitService.addUnit(this.unit).subscribe(
        (response:ServerResponse) => { 
          this.notificationService.openSnackBar(response.message, response.status);
          this.getAllUnits();
          console.log(response);
        }
      );
    }
  }

  getAllUnits() {
    this.unitService.getAllUnits().subscribe(
      units => {
        this.units = units;
      }
    );
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.unitForm.controls[controlName].hasError(errorName); 
  }

}
