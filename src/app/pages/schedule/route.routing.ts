import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./schedule-list/schedule-list.component').then(m => m.ScheduleListComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./schedule-detail/schedule-detail.component').then(m => m.ScheduleDetailComponent)
  },
  {
    path: '**', redirectTo: ''
  }
];
