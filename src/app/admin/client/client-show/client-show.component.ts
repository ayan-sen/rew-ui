import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';

@Component({
  selector: 'app-client-show',
  templateUrl: './client-show.component.html',
  styleUrls: ['./client-show.component.css']
})
export class ClientShowComponent implements OnInit {

  clients: Client[];
  
  constructor(private clientService : ClientService, private notificationService : NotificationService) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.clientService.findAll().subscribe(clients => {
      this.clients = clients;
    });
  }

  delete(client : Client) {
    this.clientService.deleteClient(client.clientId).subscribe(
      (response : ServerResponse) => {
        console.log("Delete Response >>>>");
        console.log(response);
        this.notificationService.openSnackBar(response.message, response.status);
        this.findAll();
    });
  }
}
