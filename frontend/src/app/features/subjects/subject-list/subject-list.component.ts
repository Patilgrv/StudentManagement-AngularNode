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

interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  _count?: {
    assignments: number;
    enrollments: number;
  };
}

@Component({
  selector: 'app-subject-list',
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
        <mat-card-title>Subjects</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div style="margin-bottom: 16px;">
          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Search</mat-label>
            <input matInput (input)="onSearch($event)" placeholder="Search subjects..." />
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="subjects" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let subject">{{ subject.name }}</td>
          </ng-container>

          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let subject">{{ subject.code }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let subject">{{ subject.description || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let subject">
              <button mat-icon-button color="primary" (click)="viewSubject(subject.id)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button
                *ngIf="authService.hasRole('ADMIN')"
                mat-icon-button
                color="warn"
                (click)="deleteSubject(subject.id)"
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
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  displayedColumns: string[] = ['name', 'code', 'description', 'actions'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';

  constructor(
    private api: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    const params: any = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.api.get<{ success: boolean; data: Subject[]; pagination: any }>('/subjects', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.subjects = response.data;
          this.total = response.pagination.total;
        }
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSubjects();
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.pageIndex = 0;
    this.loadSubjects();
  }

  viewSubject(id: string): void {
    console.log('View subject:', id);
  }

  deleteSubject(id: string): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.api.delete(`/subjects/${id}`).subscribe({
        next: () => {
          this.loadSubjects();
        },
        error: (error) => {
          console.error('Error deleting subject:', error);
          alert('Failed to delete subject');
        },
      });
    }
  }
}

