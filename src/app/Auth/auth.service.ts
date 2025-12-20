import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  usertoken: any;

  constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient) {
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

  login(email: string, password: string): Observable<boolean> {
    const apiRoot = typeof environment.apiRoot === 'function' ? environment.apiRoot() : environment.apiRoot;
    const loginUrl = `${apiRoot}auth/login`;
    const loginData = {
      email_mob: email,
      password: password
    };

    return this.http.post<any>(loginUrl, loginData).pipe(
      map(response => {
        console.log("Login response:", response);
        if (response && response.data && response.data.token) {
          const token = response.data.token;
          const userId = response.data._id;
          const localStorage = this.document.defaultView?.localStorage;
          if (localStorage) {
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('userId', JSON.stringify(userId));
            this.usertoken = token;
            this.isAuthenticatedSubject.next(true);
          }
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error("Login error:", error);
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  logout(): void {
    const localStorage = this.document.defaultView?.localStorage;
    const userId = localStorage?.getItem('userId');
    
    if (userId) {
      const apiRoot = typeof environment.apiRoot === 'function' ? environment.apiRoot() : environment.apiRoot;
      const logoutUrl = `${apiRoot}auth/logout`;
      
      this.http.post<any>(logoutUrl, { id: JSON.parse(userId) }).subscribe(
        () => {
          if (localStorage) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          }
          this.isAuthenticatedSubject.next(false);
        },
        () => {
          if (localStorage) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          }
          this.isAuthenticatedSubject.next(false);
        }
      );
    } else {
      if (localStorage) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
      this.isAuthenticatedSubject.next(false);
    }
  }

  register(userData: any): Observable<any> {
    const apiRoot = typeof environment.apiRoot === 'function' ? environment.apiRoot() : environment.apiRoot;
    const registerUrl = `${apiRoot}auth/register`;

    return this.http.post<any>(registerUrl, userData).pipe(
      map(response => {
        console.log("Registration response:", response);
        // Handle both response.data and response.statusCode.data formats
        const responseData = response.data || (response.statusCode && response.statusCode.data);
        if (responseData) {
          return { success: true, data: responseData };
        }
        return { success: false, data: null };
      }),
      catchError(error => {
        console.error("Registration error:", error);
        return of({ success: false, data: null });
      })
    );
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
