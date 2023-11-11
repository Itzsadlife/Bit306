import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private userType = new BehaviorSubject<string>('guest'); // 'user', 'merchant', or 'admin'
  private userEmail: string;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ message: string, role: string, _id?: string }> {
    return this.http.post<{ message: string, role: string, _id?: string }>(
      'http://localhost:3000/api/login', // Unified login endpoint
      { email, password }
    ).pipe(
      tap(response => {
        this.isAuthenticated.next(true);
        this.userType.next(response.role);
        this.userEmail = email;
        localStorage.setItem('userEmail', email); // Store the email in localStorage
        if (response._id) {
          // If there's an ID in the response, it could be used for merchant or admin
          localStorage.setItem('userId', response._id);
          console.log(response._id);
        }
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserType(): Observable<string> {
    return this.userType.asObservable();
  }

  logout() {
    this.isAuthenticated.next(false);
    this.userType.next('guest');
    this.userEmail = '';
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
  }

  getLoggedInUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  getUserEmail(): string {
    return this.userEmail || localStorage.getItem('userEmail') || '';
  }
}
