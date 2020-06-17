import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderProcessing } from './order-processing';
import { Observable } from 'rxjs';
import { ProjectMaterial } from './project-material';

@Injectable({
  providedIn: 'root'
})
export class OrderProcessingService {

  constructor(private http: HttpClient) { }

  save(orderProcessing : OrderProcessing) {
    return this.http.post("transaction/process", orderProcessing);
  }
 
  findAll() : Observable<OrderProcessing[]> {
     return this.http.get<OrderProcessing[]>("transaction/processes");
  }

  findById(processId : number) : Observable<OrderProcessing> {   
    return this.http.get<OrderProcessing>("transaction/processes/find" , {"params": {"id": processId.toString()}} );
  }

  delete(processId : number) {
    return this.http.delete("transaction/processes/delete" , {"params": {"id": processId.toString()}}  );
  }

  deleteDetail(processId : number, detailId : number) {
    let params = new HttpParams();
    params = params.append('id', processId.toString());
    params = params.append('detailId', detailId.toString());
    return this.http.delete("transaction/processes/detail/delete", {"params": params});
  }

  findMaterialsByProjectIdAndSiteId(projectId: string, siteId : string) : Observable<ProjectMaterial[]> {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    params = params.append('siteId', siteId);
    return this.http.get<ProjectMaterial[]>("/transaction/processes/materials", {"params": params});
  }
}
