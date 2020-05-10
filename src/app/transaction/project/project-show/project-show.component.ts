import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../project';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { CommonDialogComponent } from 'src/app/components/common-commponents/common-dialog/common-dialog.component';

declare const $: any;

@Component({
  selector: 'app-project-show',
  templateUrl: './project-show.component.html',
  styleUrls: ['./project-show.component.css']
})
export class ProjectShowComponent implements OnInit {

  projects : Project[] = [];
  constructor(private projectService : ProjectService, 
              private notificationService : NotificationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() { 
    this.projectService.findAll().subscribe(projects => {
      this.projects = projects;
    });
  }

  delete(project : Project) {
    this.projectService.delete(project.projectId, project.amendmentNo).subscribe(
      (response : ServerResponse) => {
        console.log("Delete Response >>>>");
        console.log(response);
        this.notificationService.openSnackBar(response.message, response.status);
        this.findAll();
    });
  }

  openDialog(project : Project): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '250px',
      data: { header : "Confirm",
              content : "Are you sure to delete?" 
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.delete(project);
      }
    });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
