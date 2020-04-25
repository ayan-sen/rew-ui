import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/components/common-service/common-model/dropdown';
import { Client } from './client';
import { ClientDetails } from './client-detail';
import { ClientService } from './client.service';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

declare const $: any;

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
  
  constructor(private clientService : ClientService, 
              private notificationService : NotificationService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.clientForm = new FormGroup({
      'clientName': new FormControl('', Validators.required),
      'clientType': new FormControl('', Validators.required),
      'gstinNo': new FormControl('', Validators.required),
      'primanyContactNo': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'primaryEmailId': new FormControl('', [Validators.required, ,Validators.email]),
      'comments': new FormControl(''),
      'isActive': new FormControl(false, Validators.required),
      'clientId': new FormControl(''),
      'details': new FormControl(''),
      'active': new FormControl('')
    });

    this.clientDetailsForm = new FormGroup({
      'address': new FormControl('', Validators.required),
      'pincode': new FormControl('', [Validators.required, Validators.maxLength(6)]),
      'identifier': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'emailId': new FormControl('', [Validators.required, ,Validators.email]),
      'contactNo': new FormControl(''),
      'comments': new FormControl(''),
      'clientId': new FormControl(''),
      'detailId': new FormControl('')
    });

    this.route.paramMap.subscribe(param => {
      this.clientService.findById(param.get('clientId')).subscribe((client:Client) =>{
        this.details = client.details;
        this.clientForm.setValue(client); 
      })
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
          console.log("success response ::");
          console.log(response);
          this.clientForm.reset();
          this.details = [];
        },
        (errorMsg:HttpErrorResponse) => {
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log("error response ::");
          console.log(errorMsg.message);
        }
      );
    }
    console.log(this.clientForm.value);
  }

  onDetailsSubmit() {
    if(this.clientDetailsForm.valid) {
      let newDetail:ClientDetails = this.clientDetailsForm.value;
      let index:number = this.details.findIndex(detail => detail.identifier == newDetail.identifier);
      console.log("last index >>" + index);
      if(index != -1) {
        this.details[index] = this.clientDetailsForm.value;
        this.notificationService.openSnackBar("Address details updated successfully", "success");
      } else {
        this.details.push(this.clientDetailsForm.value);
        this.notificationService.openSnackBar("Address details added successfully", "success");
      }
      this.clientDetailsForm.reset();
    } else {
      this.notificationService.openSnackBar("Error occurred, please review and submit again", "danger");
    }
    console.log("Client Details ::" + this.clientDetailsForm.value);
    console.log(this.clientDetailsForm.value);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
  }

  editDetail(clientDetail : ClientDetails) {
    this.clientDetailsForm.setValue(clientDetail);
  }

}
