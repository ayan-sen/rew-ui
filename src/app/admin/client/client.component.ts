import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clientForm: FormGroup;
  clientDetailsForm: FormGroup;

  activeValues: Dropdown[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'}
  ];

  clientTypes: Dropdown[] = [
    {value: 'Customer', viewValue: 'Customer'},
    {value: 'Supplier', viewValue: 'Supplier'},
    {value: 'Transporter', viewValue: 'Transporter'}
  ];
  
  constructor() { }

  ngOnInit(): void {

    this.clientForm = new FormGroup({
      'clientName': new FormControl('', Validators.required),
      'clientType': new FormControl('', Validators.required),
      'gstinNo': new FormControl('', Validators.required),
      'primanyContactNo': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'primaryEmailId': new FormControl('', [Validators.required, ,Validators.email]),
      'comments': new FormControl(''),
      'isActive': new FormControl('', Validators.required)
    });

    this.clientDetailsForm = new FormGroup({
      'address': new FormControl('', Validators.required),
      'pincode': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'identifier': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'emailId': new FormControl('', [Validators.required, ,Validators.email]),
      'contactNo': new FormControl(''),
      'comments': new FormControl('', Validators.required)
    });
  }


  public hasError = (controlName: string, errorName: string) =>{
    return this.clientForm.controls[controlName].hasError(errorName); 
  } 

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.clientDetailsForm.controls[controlName].hasError(errorName); 
  } 

  onSubmit() {
    console.log(">>>>>>");
    console.log(this.clientForm.value);
  }

  onDetailsSubmit() {
    console.log(">>>>>>");
    console.log(this.clientDetailsForm.value);
  }
}
