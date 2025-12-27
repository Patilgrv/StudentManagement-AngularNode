import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

interface Attendance {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  };
  class: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
}

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Attendance</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" (dateChange)="onDateChange($event)" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="attendance" class="mat-elevation-z8">
          <ng-container matColumnDef="student">
            <th mat-header-cell *matHeaderCellDef>Student</th>
            <td mat-cell *matCellDef="let record">
              {{ record.student.firstName }} {{ record.student.lastName }}
            </td>
          </ng-container>

          <ng-container matColumnDef="class">
            <th mat-header-cell *matHeaderCellDef>Class</th>
            <td mat-cell *matCellDef="let record">{{ record.class.name }}</td>
          </ng-container>

          <ng-container matColumnDef="subject">
            <th mat-header-cell *matHeaderCellDef>Subject</th>
            <td mat-cell *matCellDef="let record">{{ record.subject.name }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let record">{{ record.date | date: 'short' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let record">
              <span [class]="'status-' + record.status.toLowerCase()">{{ record.status }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let record">
              <button
                *ngIf="authService.hasRole('TEACHER')"
                mat-icon-button
                color="primary"
                (click)="editAttendance(record)"
              >
                <mat-icon>edit</mat-icon>
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

      .status-present {
        color: green;
        font-weight: bold;
      }

      .status-absent {
        color: red;
        font-weight: bold;
      }

      .status-late {
        color: orange;
        font-weight: bold;
      }

      .status-excused {
        color: blue;
        font-weight: bold;
      }
    `,
  ],
})
export class AttendanceListComponent implements OnInit {
  attendance: Attendance[] = [];
  displayedColumns: string[] = ['student', 'class', 'subject', 'date', 'status', 'actions'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  selectedDate: Date | null = null;

  constructor(
    private api: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    const params: any = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    if (this.selectedDate) {
      params.date = this.selectedDate.toISOString().split('T')[0];
    }

    this.api.get<{ success: boolean; data: Attendance[]; pagination: any }>('/attendance', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.attendance = response.data;
          this.total = response.pagination.total;
        }
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAttendance();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.pageIndex = 0;
    this.loadAttendance();
  }

  editAttendance(record: Attendance): void {
    console.log('Edit attendance:', record);
  }
}

