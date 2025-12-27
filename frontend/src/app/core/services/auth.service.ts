import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { AuthResponse, LoginRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private storage: StorageService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = this.storage.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials).pipe(
      map((response) => {
        if (response.success && response.data) {
          this.storage.setToken(response.data.token);
          this.storage.setUser(response.data.user);
          this.currentUserSubject.next(response.data.user);
          return response.data;
        }
        throw new Error('Login failed');
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.storage.getToken() && !!this.getCurrentUser();
  }

  hasRole(role: 'ADMIN' | 'TEACHER' | 'STUDENT'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: ('ADMIN' | 'TEACHER' | 'STUDENT')[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}

