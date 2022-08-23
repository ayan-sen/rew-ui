import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionRecord } from '../transaction/transaction-record';
import { Pay } from './pay/pay';
import { PaymentLookup } from './pay/payment-lookup';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  constructor(private http: HttpClient) { }

  save(pay: Pay) {
    return this.http.post("transaction/payment", pay);
  }

  findAll(): Observable<Pay[]> {
    return this.http.get<Pay[]>("transaction/payments");
  }

  findById(paymentId: string): Observable<Pay> {
    return this.http.get<Pay>("transaction/payment/find", { "params": { "id": paymentId } });
  }

  delete(paymentId: number) {
    return this.http.delete("transaction/payment/delete", { "params": { "id": paymentId.toString() } });
  }

  deleteDetail(paymentId: string, detailId: number) {
    let params = new HttpParams();
    params = params.append('id', paymentId);
    params = params.append('detailId', detailId.toString());
    return this.http.delete("transaction/despatches/detail/delete", { "params": params });
  }

  findOrdersByClient(clientId: string, paymentType: string): Observable<TransactionRecord[]> {
    let params = new HttpParams();
    params = params.append('clientId', clientId);
    params = params.append('paymentType', paymentType);
    return this.http.get<TransactionRecord[]>("transaction/payment/client", { "params": params });
  }

  findByProjectId(projectId: string) {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    return this.http.get<Pay[]>("transaction/despatches/project", { "params": params });
  }
}
