import { Component, Input, Renderer2 } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

const THEME_KEY = 'dashboard-theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, ConfirmModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() title = '';
  user$!: Observable<any>;
  isDarkMode = false;
  showLogoutConfirm = false;

  constructor(private userService: UsersService, private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
    this.user$ = this.userService.getMe();
    this.initTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = saved === 'dark' ? true : saved === 'light' ? false : prefersDark;
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem(THEME_KEY, this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme(): void {
    const html = document.documentElement;

    if (this.isDarkMode) {
      this.renderer.removeClass(html, 'light-mode');
      this.renderer.addClass(html, 'dark-mode');
    } else {
      this.renderer.removeClass(html, 'dark-mode');
      this.renderer.addClass(html, 'light-mode');
    }
  }

  openLogoutConfirm() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'])
      }
    });
    this.showLogoutConfirm = false;
  }

  cancelLogout() {
    this.showLogoutConfirm = false
  }
}
