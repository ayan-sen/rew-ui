import { Component, OnInit } from '@angular/core';
import { OrderProcessingService } from '../order-processing.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderProcessing } from '../order-processing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderProcessingShowService } from './order-processing-show.service';
import { OrderProcessingView } from './order-processing-view';
import { OrderProcessingDetails } from '../order-processing-details';

@Component({
  selector: 'app-order-processing-show',
  templateUrl: './order-processing-show.component.html',
  styleUrls: ['./order-processing-show.component.css']
})
export class OrderProcessingShowComponent implements OnInit {

  processes : OrderProcessing[] =[];
  opForm: FormGroup;
  processDate : Date;
  processDateString : string;
  works : OrderProcessingView;
  dateWiseWork : Map<string, OrderProcessingDetails[]>;
  toDate : Date;
  toDateString : string = "";

  constructor(private orderProcessingService : OrderProcessingService,
              private orderProcessingShowService : OrderProcessingShowService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.opForm = this.fb.group({
      'processDate': new FormControl(null, Validators.required),
      'processDateString': new FormControl(''),
      'toDate': new FormControl(null),
      'toDateString': new FormControl('')
    });
    //this.findAll();
  }

  findAll() {
    this.orderProcessingService.findAll().subscribe(processes => {
      this.processes = processes;
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.opForm.controls[controlName].hasError(errorName); 
  }

  onSubmit() {
    if (this.opForm.valid) {
      this.processDate = this.opForm.value.processDate;
      this.toDate = this.opForm.value.toDate;
      if(this.opForm.value.processDate != null) {
        this.processDateString = this.datePipe.transform(this.processDate, 'dd/MM/yyyy');
      }
      if(this.opForm.value.toDate != null) {
        this.toDateString = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
      }
      this.orderProcessingShowService.findAllByDate(this.processDateString, this.toDateString).subscribe(
        works => {
          this.works = works;
          
        }
      );
      console.log(this.works);  
    }
  }
}
