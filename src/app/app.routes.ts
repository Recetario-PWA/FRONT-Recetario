import { Routes } from '@angular/router';
import { tokenGuard } from './core/guards/token-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { codeGuard } from './core/guards/code-guard';

export const routes: Routes = [
  {
    path: 'welcome',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./features/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'recipe-detail/:id',
    loadComponent: () => import('./features/recipe-detail/recipe-detail.component').then( m => m.RecipeDetailComponent)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./shared/components/tabs/tabs.component').then( m => m.TabsComponent),
    canActivateChild: [tokenGuard],
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
        path: 'recipe/add',
        loadComponent: () => import('./features/tabs/add-recipe/add-recipe.component').then( m => m.AddRecipeComponent)
      },
      {
        path: 'recipe/:id',
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
        path: 'send-rol-Request',
        loadComponent: () => import('./features/tabs/rol-request/rol-request.page').then( m => m.RolRequestPage)
      }
    ]
  },
  {
    path: 'auth',
    canActivate: [authenticatedGuard],
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
        canActivate: [codeGuard],
        loadComponent: () => import('./features/auth/code/code.page').then( m => m.CodePage)
      }
    ]
  },
  {
    path: 'dashboard',
    children: [
      {
        path: 'edit-profile',
        loadComponent: () => import('./features/dashboard/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
      },
      {
        path: 'my-recipes',
        loadComponent: () => import('./features/dashboard/my-recipes/my-recipes.page').then( m => m.MyRecipesPage)
      },
      {
        path: 'my-comments',
        loadComponent: () => import('./features/dashboard/my-comments/my-comments.page').then( m => m.MyCommentsPage)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'rol-request',
    loadComponent: () => import('./features/tabs/rol-request/rol-request.page').then( m => m.RolRequestPage)
  }
];
