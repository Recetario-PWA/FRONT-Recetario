import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { PushService } from '../services/push';
import { currentUser } from '../stores/auth.store';

export const exitInterceptor: HttpInterceptorFn = (req, next) => {

const auth = inject(Auth);
  const router = inject(Router);
  const push = inject(PushService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        // Usuario eliminado o token inválido
                push.clear();
                localStorage.removeItem('auth_token');
                currentUser.set(null);

          router.navigate(['auth/login']);
      
      }

      return throwError(() => error);
    })
  );
};
