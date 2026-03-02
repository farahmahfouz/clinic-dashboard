import { Component, Input } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

const THEME_KEY = 'dashboard-theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() title = '';
  user$!: Observable<any>;
  isDarkMode = false;

  constructor(private userService: UsersService) {}

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
      html.classList.remove('light-mode');
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
      html.classList.add('light-mode');
    }
  }
}
