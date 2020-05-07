import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderPlacement } from './order-placement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderPlacementService {

  constructor(private http: HttpClient) { }

  save(order : OrderPlacement) {
    return this.http.post("transaction/order", order);
   }
 
   findAll() : Observable<OrderPlacement[]> {
     return this.http.get<OrderPlacement[]>("transaction/orders");
   }

   findById(orderId : string) : Observable<OrderPlacement> {   
    return this.http.get<OrderPlacement>("transaction/orders/find" , {"params": {"id": orderId}} );
   }

   delete(orderId : string) {
    return this.http.delete("/transaction/orders/delete" , {"params": {"id": orderId}}  );
   }

   deleteDetail(orderId : string, detailId : number) {
    let params = new HttpParams();
    params = params.append('id', orderId);
    params = params.append('detailId', detailId.toString());
    return this.http.delete("/transaction/orders/detail/delete", {"params": params});
   }
}
