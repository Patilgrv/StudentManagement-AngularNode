import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

interface Class {
  id: string;
  name: string;
  grade: number;
  section?: string;
  academicYear: string;
  _count?: {
    enrollments: number;
  };
}

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatPaginatorModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Classes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="classes" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let class">{{ class.name }}</td>
          </ng-container>

          <ng-container matColumnDef="grade">
            <th mat-header-cell *matHeaderCellDef>Grade</th>
            <td mat-cell *matCellDef="let class">{{ class.grade }}</td>
          </ng-container>

          <ng-container matColumnDef="section">
            <th mat-header-cell *matHeaderCellDef>Section</th>
            <td mat-cell *matCellDef="let class">{{ class.section || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="academicYear">
            <th mat-header-cell *matHeaderCellDef>Academic Year</th>
            <td mat-cell *matCellDef="let class">{{ class.academicYear }}</td>
          </ng-container>

          <ng-container matColumnDef="enrollments">
            <th mat-header-cell *matHeaderCellDef>Enrollments</th>
            <td mat-cell *matCellDef="let class">{{ class._count?.enrollments || 0 }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let class">
              <button mat-icon-button color="primary" (click)="viewClass(class.id)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button
                *ngIf="authService.hasRole('ADMIN')"
                mat-icon-button
                color="warn"
                (click)="deleteClass(class.id)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mat-paginator
          [length]="total"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex"
          [pageSizeOptions]="[5, 10, 20, 50]"
          (page)="onPageChange($event)"
        ></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
    `,
  ],
})
export class ClassListComponent implements OnInit {
  classes: Class[] = [];
  displayedColumns: string[] = ['name', 'grade', 'section', 'academicYear', 'enrollments', 'actions'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private api: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    const params = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.api.get<{ success: boolean; data: Class[]; pagination: any }>('/classes', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.classes = response.data;
          this.total = response.pagination.total;
        }
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClasses();
  }

  viewClass(id: string): void {
    console.log('View class:', id);
  }

  deleteClass(id: string): void {
    if (confirm('Are you sure you want to delete this class?')) {
      this.api.delete(`/classes/${id}`).subscribe({
        next: () => {
          this.loadClasses();
        },
        error: (error) => {
          console.error('Error deleting class:', error);
          alert('Failed to delete class');
        },
      });
    }
  }
}

