import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Event, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SideBarItem } from './sidebar/sidebar-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }

  getMenu() : Observable<SideBarItem[]> {

    return this.http.get<SideBarItem[]>("http://localhost:8080/rew-portal/admin/menu");
  }
  

}
