import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryChart } from '../dashboard/inventory-chart';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  getInventoryStatus() : Observable<InventoryChart> {
    return this.http.get<InventoryChart>("transaction/inventory");
 }
}
