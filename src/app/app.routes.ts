import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.page').then( m => m.LoginPage)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.page').then( m => m.RegisterPage)
      },
      {
        path: 'verify-code',
        loadComponent: () => import('./features/auth/code/code.page').then( m => m.CodePage)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];
