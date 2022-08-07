import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { OrderDespatchService } from '../../order-despatch.service';
import { Project } from '../../project/project';
import { ProjectService } from '../../project/project.service';
import { OrderDespatch } from '../order-despatch';

@Component({
  selector: 'app-order-despatch-show',
  templateUrl: './order-despatch-show.component.html',
  styleUrls: ['./order-despatch-show.component.css']
})
export class OrderDespatchShowComponent implements OnInit {

  odForm : FormGroup;
  projectId : string;

  despatches : OrderDespatch[] = [];

  projects : Project[] = [];

  constructor(private orderDespatchService : OrderDespatchService,
              private projectService : ProjectService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private notificationService : NotificationService,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getProjects();

    this.odForm = this.fb.group({
      'projectId': new FormControl('', Validators.required)
      
    });


  }

  getProjects() {
    this.projectService.findAll().subscribe(
      projects => {
        this.projects = projects;
      }
    );
  }

  populatDetailLists(event : MatSelectChange) {
    let projectId = event.value;
    this.orderDespatchService.findByProjectId(projectId).subscribe(
      despatches => {
        this.despatches = despatches;
      }
    );
  }


  onSubmit() {
    
  }

}
