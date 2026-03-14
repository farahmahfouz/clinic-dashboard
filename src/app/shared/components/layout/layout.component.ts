import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastComponent } from "../toast/toast.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  title = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.updateTitle();
    this.router.events.subscribe(() => this.updateTitle());
  }

  private updateTitle(): void {
    const route = this.getLeafRoute(this.activatedRoute);
    this.title = (route?.snapshot?.title as string) ?? 'Dashboard';
  }

  private getLeafRoute(route: ActivatedRoute): ActivatedRoute | null {
    let r: ActivatedRoute | null = route;
    while (r?.firstChild) r = r.firstChild;
    return r;
  }
}
