import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { Client } from './client';
import { ClientDetails } from './client-detail';
import { ClientService } from './client.service';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clientForm: FormGroup;
  clientDetailsForm: FormGroup;
  client : Client;
  details : ClientDetails[] = [];

  activeValues: Dropdown[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'}
  ];

  clientTypes: Dropdown[] = [
    {value: 'Customer', viewValue: 'Customer'},
    {value: 'Supplier', viewValue: 'Supplier'},
    {value: 'Transporter', viewValue: 'Transporter'}
  ];
  
  constructor(private clientService : ClientService, private notificationService : NotificationService) { }

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
      'identifier': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'emailId': new FormControl('', [Validators.required, ,Validators.email]),
      'contactNo': new FormControl(''),
      'comments': new FormControl('')
    });
  }


  public hasError = (controlName: string, errorName: string) =>{
    return this.clientForm.controls[controlName].hasError(errorName); 
  } 

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.clientDetailsForm.controls[controlName].hasError(errorName); 
  } 

  onSubmit() {
    if(this.clientForm.valid) {
      this.client = this.clientForm.value;
      this.client.details = this.details;
      this.clientService.save(this.client).subscribe(
        (response:ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          console.log(response);
        },
        (errorMsg:HttpErrorResponse) => {
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log(errorMsg);
        }
      );

    }
    console.log(this.clientForm.value);
  }

  onDetailsSubmit() {
    if(this.clientDetailsForm.valid) {
      this.details.push(this.clientDetailsForm.value);
    }
    console.log(this.clientDetailsForm.value);
  }
}
