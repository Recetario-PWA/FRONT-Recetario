import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./shared/components/tabs/tabs.component').then( m => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/tabs/home/home.component').then( m => m.HomeComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/tabs/favorites/favorites.component').then( m => m.FavoritesComponent)
      },
      {
        path: 'add-recipe',
        loadComponent: () => import('./features/tabs/add-recipe/add-recipe.component').then( m => m.AddRecipeComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/tabs/dashboard/dashboard.component').then( m => m.DashboardComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/tabs/notifications/notifications.component').then( m => m.NotificationsComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
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
