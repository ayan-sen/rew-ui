import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project } from './project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  findAll() : Observable<Project[]> {
    return this.http.get<Project[]>("transaction/projects");
  }


  save(project : Project) {
    return this.http.post("transaction/project", project);
   }
 
   findById(projectId : string, amendmentNo : number) : Observable<Project> {   
    let params = new HttpParams();
    params = params.append('id', projectId);
    params = params.append('amendmentNo', amendmentNo.toString());
    return this.http.get<Project>("transaction/projects/find" , {"params": params} );
   }

   delete(projectId : string, amendmentNo : number) {
    let params = new HttpParams();
    params = params.append('id', projectId);
    params = params.append('amendmentNo', amendmentNo.toString());
    return this.http.delete("/transaction/projects/delete" ,  {"params": params}  );
   }

   deleteDetail(projectId : string, amendmentNo : number, detailId : number) {
    let params = new HttpParams();
    params = params.append('id', projectId);
    params = params.append('amendmentNo', amendmentNo.toString());
    params = params.append('detailId', detailId.toString());
    return this.http.delete("/transaction/projetcs/detail/delete", {"params": params});
   }
}
