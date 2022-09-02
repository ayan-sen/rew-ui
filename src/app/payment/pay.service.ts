import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionRecord } from '../transaction/transaction-record';
import { Pay } from './pay/pay';
import { PaymentLookup } from './pay/payment-lookup';
import { PaymentSummary } from './pay/payment-summary';
import { PaymentView } from './pay/payment-view';

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
    return this.http.delete("transaction/payment/detail/delete", { "params": params });
  }

  findOrdersByClient(clientId: string, paymentType: string): Observable<TransactionRecord[]> {
    let params = new HttpParams();
    params = params.append('clientId', clientId);
    params = params.append('paymentType', paymentType);
    return this.http.get<TransactionRecord[]>("transaction/record/client", { "params": params });
  }

  findByCLientId(clientId: string) : Observable<Pay[]> {
    let params = new HttpParams();
    params = params.append('clientId', clientId);
    return this.http.get<Pay[]>("transaction/payment/client", { "params": params });
  }

  findPaymentReport(clientId : string, fromDateString : string, toDateString : string) : Observable<PaymentSummary> {
    let params = new HttpParams();
    params = params.append('clientId', clientId);
    params = params.append('fromDate', fromDateString);
    params = params.append('toDate', toDateString);
    return this.http.get<PaymentSummary>("transaction/payment/report", { "params": params });
  }
}
