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
    return this.http.post("admin/client", client);
   }
 
   findAll() : Observable<Client[]> {
     return this.http.get<Client[]>("admin/clients");
   }

   findById(clientId : string) : Observable<Client> {
    return this.http.get<Client>("admin/clients/" +clientId );
   }

   deleteClient(clientId : string) {
    return this.http.delete("admin/clients/" +clientId );
   }

   deleteClientDetail(clientId : string, detailId : number) {
     let url = "admin/clients/"+clientId + "/detail/" + detailId;
    return this.http.delete(url);
   }
}
