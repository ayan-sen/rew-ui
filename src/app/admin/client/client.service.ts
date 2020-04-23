import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'src/app/components/common-service/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Client } from './client';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
}
