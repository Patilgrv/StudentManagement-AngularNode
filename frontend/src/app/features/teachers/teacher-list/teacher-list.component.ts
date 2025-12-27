import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Teachers</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div style="margin-bottom: 16px;">
          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Search</mat-label>
            <input matInput (input)="onSearch($event)" placeholder="Search teachers..." />
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="teachers" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let teacher">{{ teacher.firstName }} {{ teacher.lastName }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let teacher">{{ teacher.user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let teacher">{{ teacher.department || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let teacher">
              <button mat-icon-button color="primary" (click)="viewTeacher(teacher.id)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteTeacher(teacher.id)">
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
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  displayedColumns: string[] = ['name', 'email', 'department', 'actions'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';

  constructor(
    private api: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    const params: any = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.api.get<{ success: boolean; data: Teacher[]; pagination: any }>('/teachers', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.teachers = response.data;
          this.total = response.pagination.total;
        }
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTeachers();
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.pageIndex = 0;
    this.loadTeachers();
  }

  viewTeacher(id: string): void {
    console.log('View teacher:', id);
  }

  deleteTeacher(id: string): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.api.delete(`/teachers/${id}`).subscribe({
        next: () => {
          this.loadTeachers();
        },
        error: (error) => {
          console.error('Error deleting teacher:', error);
          alert('Failed to delete teacher');
        },
      });
    }
  }
}

