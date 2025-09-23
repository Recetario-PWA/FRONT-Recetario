import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const tokenGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  } else {
    router.navigateByUrl('/auth/login');
    return false;
  }
};
