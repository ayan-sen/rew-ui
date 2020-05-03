import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderPlacementDetails } from './order-placement-details';
import { rowsAnimation } from './template.animations';
import { MatTableDataSource } from '@angular/material/table';
import { OrderPlacement } from './order-placement';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-order-placement',
  templateUrl: './order-placement.component.html',
  styleUrls: ['./order-placement.component.css'],
  animations: [rowsAnimation]
})
export class OrderPlacementComponent implements OnInit {

  opForm: FormGroup;

  opDetailForm: FormGroup;

  orderPlacement : OrderPlacement;

  details : OrderPlacementDetails[];
  
  displayedColumns = ['rmId', 'quantity', 'unitId'];

  constructor() { 
  }
  

  ngOnInit(): void {
    this.opForm = new FormGroup({
      'orderId': new FormControl(''),
      'supplierId': new FormControl(''),
      'supplierDetailsId': new FormControl(''),
      'expectedDeliveryDate': new FormControl(null, Validators.required),
      'actualDeliveryDate': new FormControl(null),
      'status': new FormControl('', Validators.required),
      'notes': new FormControl('', Validators.required)
    });

    this.opDetailForm = new FormGroup({
      'orderId': new FormControl(''),
      'orderDetailsId': new FormControl(''),
      'rmId': new FormControl('', Validators.required),
      'unitId': new FormControl('', Validators.required),
      'quantity': new FormControl('', Validators.required)
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.opForm.controls[controlName].hasError(errorName); 
  }

  public hasDetailError = (controlName: string, errorName: string) =>{
    return this.opDetailForm.controls[controlName].hasError(errorName); 
  }

  

  onSubmit() {

  }

  onDetailSubmit() {


  }

  close(frame : ModalDirective )  {
    frame.hide();
  }
}
