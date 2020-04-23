import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-show',
  templateUrl: './client-show.component.html',
  styleUrls: ['./client-show.component.css']
})
export class ClientShowComponent implements OnInit {

  clients: Client[];
  
  constructor(private clientService : ClientService) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.clientService.findAll().subscribe(clients => {
      this.clients = clients;
    });
  }

  edit(client : Client) {
    
  }
}
