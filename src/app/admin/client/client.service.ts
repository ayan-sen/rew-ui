import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/app/components/common-service/error-handler.service';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient, private errorHandler : ErrorHandlerService) { }

  save(client : Client) {
    return this.http.post("http://localhost:8080/rew-portal/admin/client", client);
   }
 
   findAll() : Observable<Client[]> {
     return this.http.get<Client[]>("http://localhost:8080/rew-portal/admin/clients");
   }

   findById(clientId : string) : Observable<Client> {
    return this.http.get<Client>("http://localhost:8080/rew-portal/admin/clients/" +clientId );
   }

   deleteClient(clientId : string) {
    return this.http.delete("http://localhost:8080/rew-portal/admin/clients/" +clientId );
   }

   deleteClientDetail(clientId : string, detailId : number) {
     let url = "http://localhost:8080/rew-portal/admin/clients/"+clientId + "/detail/" + detailId;
    return this.http.delete(url);
   }
}
