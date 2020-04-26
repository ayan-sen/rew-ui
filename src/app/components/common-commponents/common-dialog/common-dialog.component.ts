import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonDialog } from './comon-dialog';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommonDialog
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.data.submit = false;
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.data.submit = true;
    this.dialogRef.close();
  }
}
