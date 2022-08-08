import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDespatch } from './order-despatch/order-despatch';
import { ProjectMaterial } from './order-processing/project-material';

@Injectable({
  providedIn: 'root'
})
export class OrderDespatchService {
  
  constructor(private http: HttpClient) { }

  save(orderDespatch : OrderDespatch) {
    return this.http.post("transaction/despatch", orderDespatch);
  }
 
  findAll() : Observable<OrderDespatch[]> {
     return this.http.get<OrderDespatch[]>("transaction/despatches");
  }

  findById(despatchId : string) : Observable<OrderDespatch> {   
    return this.http.get<OrderDespatch>("transaction/despatch/find" , {"params": {"id": despatchId}} );
  }

  delete(despatchId : number) {
    return this.http.delete("transaction/processes/delete" , {"params": {"id": despatchId.toString()}}  );
  }

  deleteDetail(despatchId : string, detailId : number) {
    let params = new HttpParams();
    params = params.append('id', despatchId);
    params = params.append('detailId', detailId.toString());
    return this.http.delete("transaction/despatches/detail/delete", {"params": params});
  }

  findMaterialsByProjectIdAndSiteId(projectId: string, siteId : string) : Observable<ProjectMaterial[]> {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    params = params.append('siteId', siteId);
    return this.http.get<ProjectMaterial[]>("transaction/despatches/materials", {"params": params});
  }

  findByProjectId(projectId: string) {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    return this.http.get<OrderDespatch[]>("transaction/despatches/project", {"params": params});
  }

}
