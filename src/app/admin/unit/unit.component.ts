import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unit } from './unit';
import { UnitService } from './unit.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  unitForm: FormGroup;

  unit : Unit;

  constructor(private unitService : UnitService) { }

  ngOnInit(): void {
     this.unitForm = new FormGroup({
      'unitId': new FormControl('', Validators.required),
      'unitName': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    
    if(this.unitForm.valid) {
      this.unit = this.unitForm.value;
      console.log(this.unit);
      this.unitService.addUnit(this.unit).subscribe(
        response => {
          console.log(response);
        }
      );
    }
   
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.unitForm.controls[controlName].hasError(errorName); 
  }

}
