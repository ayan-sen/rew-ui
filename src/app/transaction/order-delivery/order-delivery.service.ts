import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderDelivery } from './order-delivery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderDeliveryService {

  constructor(private http: HttpClient) { }

  save(order : OrderDelivery) {
    return this.http.post("transaction/delivery", order);
  }
 
  findAll() : Observable<OrderDelivery[]> {
     return this.http.get<OrderDelivery[]>("transaction/deliveries");
  }

  findById(deliveryId : string) : Observable<OrderDelivery> {   
    return this.http.get<OrderDelivery>("transaction/deliveries/find" , {"params": {"id": deliveryId}} );
  }

  delete(deliveryId : string) {
    return this.http.delete("transaction/deliveries/delete" , {"params": {"id": deliveryId}}  );
  }

  deleteDetail(deliveryId : string, detailId : number) {
    let params = new HttpParams();
    params = params.append('id', deliveryId);
    params = params.append('detailId', detailId.toString());
    return this.http.delete("transaction/deliveries/detail/delete", {"params": params});
  }

}
