import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarItem } from './sidebar-item';
import { SidebarService } from './sidebar.service';
import { LoginService } from '../login/login.service';

declare const $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit,AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  expanded: boolean;
  depth: number = 0;
  sideBarItems: SideBarItem[] = [];

  constructor(public sidebarService: SidebarService, private loginService : LoginService,
    public router: Router) { 

      this.loadMenu();

    }

    loadMenu() {
      this.sidebarService.getMenu().subscribe( 
        items => {
          this.sideBarItems = items;
        }
      );
    }
  
  ngAfterViewInit(): void {
      this.sidebarService.appDrawer = this.appDrawer;
      this.loginService.brodcast.subscribe(d => {
        if(d) {
          this.loadMenu();
        }
      });
  }

  ngOnInit() { 
    this.loginService.brodcast.subscribe(d => {
      if(d) {
        this.loadMenu();
      }
    });
  }
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  }

}
