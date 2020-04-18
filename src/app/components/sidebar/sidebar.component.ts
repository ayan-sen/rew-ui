import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { SideBarItem } from './sidebar-item';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarComponent implements OnInit,AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  //item: SideBarItem;
  depth: number = 0;
  sideBarItems: SideBarItem[] = [
    {
      displayName: 'Speakers',
      iconName: 'group',
      route: 'devfestfl/speakers',
      children: [
        {
          displayName: 'Michael Prentice',
          iconName: 'person',
          route: 'devfestfl/speakers/michael-prentice',
          children: [
            {
              displayName: 'Create Enterprise UIs',
              iconName: 'star_rate',
              route: '/dashboard'
            }
          ]
        }
      ]
    }
  ];

  menuItems: any[];

  constructor(public sidebarService: SidebarService,
    public router: Router) { }
  
  ngAfterViewInit(): void {
      this.sidebarService.appDrawer = this.appDrawer;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  onItemSelected(item: SideBarItem) {

    this.sidebarService.currentUrl.subscribe((url: string) => {
      if (item.route && url) {
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        this.expanded = url.indexOf(`/${item.route}`) === 0;
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });

    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      this.sidebarService.closeNav();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
