import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, concatMap, Observable, Subject, tap } from 'rxjs';
import { Firm } from 'src/app/pages/auth/firm';
import { Router } from '@angular/router';
import { User } from 'src/app/pages/auth/user';
import { APIResult } from '../api-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = {} as User;
  testService: BehaviorSubject<string> = new BehaviorSubject("service called");
  userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  appRoot = "auth";
  urlRoot = `${environment.API_BASE_URL}/${this.appRoot}`

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private _tokenService: TokenStorageService,
    private router: Router
  ) { }
  
  userSubjectGetValue(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
  userSubjectSetValue(user:User): void {
    this.userSubject.next(user);
  };

  
  

  getFirms(): Observable<Firm[]> {
    const url = `${this.urlRoot}/firm/`

    return this.http.get<Firm[]>(url).pipe(
      tap(() => console.log('getFirms()', Math.random())),
    );
  }

  createFirm(firm: Firm) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}/firm/`;

      this.http.post(url, firm).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this.handleError(error));
        }
      })
    })
  }

  isLoggedIn(): boolean {
    return !!this._tokenService.getAccessToken();
  }

  register(user:User) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}/register/`;

      this.http.post(url, user).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success"){
            resolve(result);

          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this.handleError(error));
        }
      })
    })
  }

  updateUser(user: User): Observable<any> {
    const url = `${this.urlRoot}/user/${user.pk}/`;
    
    return this.http.put(url, user, this.httpOptions).pipe(
      tap(() => console.log('updateUser()', Math.random()))
    )
  }

  updateFirm(firm: Firm): Observable<any> {
    const url = `${this.urlRoot}/firm/${firm.id}/`;
    
    return this.http.put(url, firm, this.httpOptions).pipe(
      tap(() => console.log('updateFirm()', Math.random()))
    )
  }

  login(email: string, password: string) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}/login/`;
      const body = {email: email, password: password};

      this.http.post(url, body).subscribe({
        next: (data) => {
          const result = data as APIResult;

          if (result.status === "success"){
            this._tokenService.saveAccessToken(result.response.access);
            this._tokenService.saveRefreshToken(result.response.refresh);
            resolve(result);

          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this.handleError(error));

        }
      })
    })
  }

  getUser(): Observable<User> {
    const url = `${this.urlRoot}/user/`;
    return this.http.get<User>(url).pipe(
      tap(() => console.log('getUser()', Math.random()))
    )
  }

  refreshToken(token: string) {
    const url = `${this.urlRoot}/token/refresh/`; 
    const body = {"refresh": token};
    return this.http.post<any>(url, body).pipe(
      tap(() => console.log('refreshToken()', Math.random()))
    )
  }

  logout() {
    this.router.navigate(['/']);
    this._tokenService.deleteTokens();
  }

  forgot(email: string) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}/forgot/`;
      const body = {email: email};

      this.http.post(url, body).subscribe({
        next: (data) => {
          const result = data as APIResult;

          if (result.status === "success"){
            this._tokenService.deleteTokens()
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this.handleError(error));
        }
      })
    })
  }

  reset(password: string, password_confirm: string, token: string) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}/reset/`;
      const body = {
        password: password, 
        password_confirm: password_confirm,
        token: token
      };

      this.http.post(url, body).subscribe({
        next: (data) => {
          const result = data as APIResult;
          
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this.handleError(error));
        }
      })
    })
  }

  private handleError(errorRes: HttpErrorResponse): Array<string> {
    console.log("errorRes:", errorRes);
    
    let errors = errorRes.error.response

    if('token' in errors) {
      errors = [errors.token.message]
    } {
      errors = Object.values(errors)
    }
    
    return errors;
  }


}
