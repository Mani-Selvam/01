import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router){

  }
  customClick(route: string): void {
    this.router.navigate([route]);
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}
