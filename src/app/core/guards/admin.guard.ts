import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(UsersService);
  const router = inject(Router);

 return authService.getMe().pipe(
    map((user) => {
      if (user.role === 'admin') {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};
