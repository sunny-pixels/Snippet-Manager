import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'snippets',
    loadComponent: () =>
      import('./pages/snippet-list/snippet-list.component').then((m) => m.SnippetListComponent),
  },
  {
    path: 'snippets/add',
    loadComponent: () =>
      import('./pages/snippet-form/snippet-form.component').then((m) => m.SnippetFormComponent),
  },
  {
    path: 'snippets/edit/:id',
    loadComponent: () =>
      import('./pages/snippet-form/snippet-form.component').then((m) => m.SnippetFormComponent),
  },
  {
    path: 'snippets/:id',
    loadComponent: () =>
      import('./pages/snippet-detail/snippet-detail.component').then(
        (m) => m.SnippetDetailComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.component').then((m) => m.CategoriesComponent),
  },
  {
    path: 'tags',
    loadComponent: () => import('./pages/tags/tags.component').then((m) => m.TagsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
