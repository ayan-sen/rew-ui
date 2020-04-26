import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Unit } from './unit';
import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private http: HttpClient) { }

  addUnit(unit : Unit) {
   return this.http.put("admin/unit", unit);
  }

  getAllUnits() : Observable<Unit[]> {
    return this.http.get<Unit[]>("admin/units");
  }

  
}
