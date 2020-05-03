import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderPlacement } from './order-placement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderPlacementService {

  constructor(private http: HttpClient) { }

  save(order : OrderPlacement) {
    return this.http.post("transaction/order-placement", order);
   }
 
   findAll() : Observable<OrderPlacement[]> {
     return this.http.get<OrderPlacement[]>("transaction/order-placements");
   }

   findById(orderId : string) : Observable<OrderPlacement> {
    return this.http.get<OrderPlacement>("transaction/order-placements/" +orderId );
   }

   deleteClient(orderId : string) {
    return this.http.delete("transaction/order-placements/" +orderId );
   }

   deleteClientDetail(orderId : string, detailId : number) {
    let url = "transaction/order-placements/"+orderId + "/detail/" + detailId;
    return this.http.delete(url);
   }
}
