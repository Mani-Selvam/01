import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  usertoken: any;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus(): void {
    console.warn('localStorage ');
    
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      this.usertoken = localStorage.getItem('token');
      this.isAuthenticatedSubject.next(!!this.usertoken);
    } else {
      console.warn('localStorage is not available. Authentication status check skipped.');
    }
  }

  login(username: string, password: string): Observable<boolean> {
    if (username === 'Admin' && password === 'Admin@123') {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVhOWVhNzFjMmY3M2YxZTIyZjc2Y2EyIiwiaWF0IjoxNzA1NjM0NTk5LCJleHAiOjE3MzcxNzA1OTl9.NhEcTes1GLmy-SQEaA8HZoYK7VP7DWoHOFxWd1zTeCU';
      const userId = '22';
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('userId', JSON.stringify(userId));
      this.isAuthenticatedSubject.next(true);
      return of(true); // Return a synchronous observable
    } else {
      this.isAuthenticatedSubject.next(false);
      return of(false); // Return a synchronous observable
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
  
    if (localStorage) {
      console.log("localStorageeee",localStorage);
      
      this.usertoken = localStorage.getItem('token');
      this.isAuthenticatedSubject.next(!!this.usertoken);
    } else {
      console.warn('localStorage is not available. Authentication status check skipped.');
    }
    return !!this.usertoken;
  }
}
