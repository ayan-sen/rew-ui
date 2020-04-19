import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  durationInSeconds = 50;

constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, type: string) { 
    
    let config = new MatSnackBarConfig();
    config.panelClass = ['btn-danger'];
    config.duration = this.durationInSeconds * 1000
    config.horizontalPosition ='right';
    switch(type) { 
      case 'success' :  config.panelClass = ['btn-success'];
                        break;
      case 'failure' :  config.panelClass = ['btn-danger'];
                        break;
      default        :  config.panelClass = ['btn-info'];
    }
    this._snackBar.open(message , '', config);  
  }
}
