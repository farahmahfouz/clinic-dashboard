import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ServicesComponent } from './features/services/services.component';
import { SubServicesComponent } from './features/sub-services/sub-services.component';
import { OptionsComponent } from './features/options/options.component';
import { UsersComponent } from './features/users/users.component';
import { SchedualsComponent } from './features/scheduals/scheduals.component';
import { SettingsComponent } from './features/settings/settings.component';
import { BookingsComponent } from './features/bookings/bookings.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthComponent } from './features/auth/auth.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: AuthComponent,
        title: 'HERA'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: HomeComponent,
                title: 'Home',
            },
            {
                path: 'services',
                component: ServicesComponent,
                title: 'Services',
            },
            {
                path: 'sub-services',
                component: SubServicesComponent,
                title: 'SubServices'
            },
            {
                path: 'options/:slug',
                component: OptionsComponent,
                title: 'Options',
            },
            {
                path: 'options',
                component: OptionsComponent,
                title: 'Options',
            },
            {
                path: 'users',
                component: UsersComponent,
                title: 'Users'
            },
            {
                path: 'bookings',
                component: BookingsComponent,
                title: 'Bookings'
            },
            {
                path: 'scheduals',
                component: SchedualsComponent,
                title: 'Scheduals'
            },
            {
                path: 'settings',
                component: SettingsComponent,
                title: 'Settings'
            }
        ],
        canActivate: [adminGuard]
    },
];
