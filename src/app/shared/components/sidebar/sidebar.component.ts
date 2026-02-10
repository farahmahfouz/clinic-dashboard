import { Component } from '@angular/core';
import { HomeIconComponent } from '../../icons/home-icon.component';
import { BookingsIconComponent } from '../../icons/bookings-icon.component';
import { ServicesIconComponent } from '../../icons/services-icon.component';
import { SubservicesIconComponent } from '../../icons/subservices-icon.component';
import { OptionsIconComponent } from '../../icons/options-icon.component';
import { UsersIconComponent } from '../../icons/users-icon.component';
import { SchedulesIconComponent } from '../../icons/schedules-icon.component';
import { SettingsIconComponent } from '../../icons/settings-icon.component';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    HomeIconComponent,
    BookingsIconComponent,
    ServicesIconComponent,
    SubservicesIconComponent,
    OptionsIconComponent,
    UsersIconComponent,
    SchedulesIconComponent,
    SettingsIconComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
