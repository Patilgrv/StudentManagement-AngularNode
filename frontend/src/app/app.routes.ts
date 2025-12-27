import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'students',
    canActivate: [authGuard, roleGuard(['ADMIN', 'TEACHER'])],
    loadComponent: () => import('./features/students/student-list/student-list.component').then((m) => m.StudentListComponent),
  },
  {
    path: 'teachers',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./features/teachers/teacher-list/teacher-list.component').then((m) => m.TeacherListComponent),
  },
  {
    path: 'classes',
    canActivate: [authGuard, roleGuard(['ADMIN', 'TEACHER'])],
    loadComponent: () => import('./features/classes/class-list/class-list.component').then((m) => m.ClassListComponent),
  },
  {
    path: 'subjects',
    canActivate: [authGuard, roleGuard(['ADMIN', 'TEACHER'])],
    loadComponent: () => import('./features/subjects/subject-list/subject-list.component').then((m) => m.SubjectListComponent),
  },
  {
    path: 'attendance',
    canActivate: [authGuard, roleGuard(['ADMIN', 'TEACHER', 'STUDENT'])],
    loadComponent: () => import('./features/attendance/attendance-list/attendance-list.component').then((m) => m.AttendanceListComponent),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

