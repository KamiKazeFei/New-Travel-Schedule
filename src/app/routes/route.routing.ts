import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'schedule',
    loadChildren: () => import('../pages/schedule/route.routing').then(m => m.routes)
  },
  {
    path: '**', redirectTo: 'schedule'
  }
];

