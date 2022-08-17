import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from './invoice/invoice';
import { ProjectMaterial } from './order-processing/project-material';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  save(invoice : Invoice) {
    return this.http.post("transaction/invoice", invoice);
  }
 
  findAll() : Observable<Invoice[]> {
     return this.http.get<Invoice[]>("transaction/invoices");
  }

  findById(invoiceId : string) : Observable<Invoice> {   
    return this.http.get<Invoice>("transaction/invoice/find" , {"params": {"id": invoiceId}} );
  }

  delete(invoiceId : string) {
    return this.http.delete("transaction/invoices/delete" , {"params": {"id": invoiceId.toString()}}  );
  }

  deleteDetail(invoiceId : string, detailId : number) {
    let params = new HttpParams();
    params = params.append('id', invoiceId);
    params = params.append('detailId', detailId.toString());
    return this.http.delete("transaction/invoices/detail/delete", {"params": params});
  }

  findMaterialsByProjectIdAndSiteId(projectId: string) : Observable<ProjectMaterial[]> {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    return this.http.get<ProjectMaterial[]>("transaction/invoice/products", {"params": params});
  }

  findByProjectId(projectId: string) {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    return this.http.get<Invoice[]>("transaction/invoices/project", {"params": params});
  }
}
