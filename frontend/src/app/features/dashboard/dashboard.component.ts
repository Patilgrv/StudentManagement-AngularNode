import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div *ngIf="user">
      <h1>Welcome, {{ user.email }}!</h1>
      <p>Role: {{ user.role }}</p>

      <div *ngIf="user.role === 'ADMIN'" class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Students</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage student records</p>
            <button mat-raised-button color="primary" routerLink="/students">
              <mat-icon>people</mat-icon>
              View Students
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Teachers</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage teacher records</p>
            <button mat-raised-button color="primary" routerLink="/teachers">
              <mat-icon>person</mat-icon>
              View Teachers
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Classes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage classes</p>
            <button mat-raised-button color="primary" routerLink="/classes">
              <mat-icon>class</mat-icon>
              View Classes
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Subjects</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage subjects</p>
            <button mat-raised-button color="primary" routerLink="/subjects">
              <mat-icon>book</mat-icon>
              View Subjects
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Attendance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View attendance reports</p>
            <button mat-raised-button color="primary" routerLink="/attendance">
              <mat-icon>check_circle</mat-icon>
              View Attendance
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="user.role === 'TEACHER'" class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Students</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View student records</p>
            <button mat-raised-button color="primary" routerLink="/students">
              <mat-icon>people</mat-icon>
              View Students
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Classes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View classes</p>
            <button mat-raised-button color="primary" routerLink="/classes">
              <mat-icon>class</mat-icon>
              View Classes
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Subjects</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View subjects</p>
            <button mat-raised-button color="primary" routerLink="/subjects">
              <mat-icon>book</mat-icon>
              View Subjects
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Attendance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Mark and view attendance</p>
            <button mat-raised-button color="primary" routerLink="/attendance">
              <mat-icon>check_circle</mat-icon>
              Manage Attendance
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="user.role === 'STUDENT'" class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>My Attendance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View your attendance records</p>
            <button mat-raised-button color="primary" routerLink="/attendance">
              <mat-icon>check_circle</mat-icon>
              View Attendance
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .dashboard-card {
        height: 100%;
      }

      mat-card-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      button {
        width: 100%;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }
}

