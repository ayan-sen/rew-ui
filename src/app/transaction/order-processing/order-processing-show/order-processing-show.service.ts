import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderProcessingView } from './order-processing-view';

@Injectable({
  providedIn: 'root'
})
export class OrderProcessingShowService {

  constructor(private http: HttpClient) { }

  findAllByDate(date: string, toDate : string) : Observable<OrderProcessingView> {
    let params = new HttpParams();
    params = params.set('logDate', date);
    params = params.append('toDate', toDate);
    return this.http.get<OrderProcessingView>("transaction/processes/date", {"params": params});
  } 
}
