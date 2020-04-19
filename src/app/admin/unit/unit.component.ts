import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unit } from './unit';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  unitForm: FormGroup;

  unit : Unit;

  constructor() { }

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
    }
   
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.unitForm.controls[controlName].hasError(errorName); 
  }

}
