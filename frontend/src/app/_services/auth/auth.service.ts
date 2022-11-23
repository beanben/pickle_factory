import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Firm } from 'src/app/pages/auth/firm';
import { Router } from '@angular/router';
import { User } from 'src/app/pages/auth/user';
import { APIResult } from '../api-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appRoot = "auth";
  urlRoot = `${environment.API_BASE_URL}/${this.appRoot}/`

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

  /** GET: get all firms */
  getFirms(): Observable<Firm[]> {
    const url = `${this.urlRoot}firm/`

    return this.http.get<Firm[]>(url).pipe(
      tap(() => console.log('getFirms()', Math.random())),
    );
  }

  /** POST: create a new firm */
  createFirm(firm: Firm): Observable<Firm> {
    const url = `${this.urlRoot}firm/`;
    const httpOptions = this.httpOptions;

    return this.http.post<Firm>(url, firm, httpOptions).pipe(
      tap(() => console.log('createFirm()', Math.random()))
    );
  }

  isLoggedIn(): boolean {
    return !!this._tokenService.getAccessToken();
  }

  register(user:User) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}register/`;

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

  login(email: string, password: string) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}login/`;
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
    const url = `${this.urlRoot}user/`;
    return this.http.get<User>(url).pipe(
      tap(() => console.log('getUser()', Math.random()))
    )
  }

  refreshToken(token: string) {
    const url = `${this.urlRoot}token/refresh/`; 
    const body = {"refresh": token};
    return this.http.post<any>(url, body)
  }

  logout() {
    this.router.navigate(['/landing']);
    this._tokenService.deleteRefreshToken();
    this._tokenService.deleteAccessToken();
  }

  private handleError(errorRes: HttpErrorResponse): Array<string> {
    console.log("errorRes:", errorRes);
    let errors = ['An unknown error occurred!'];

    if (errorRes.error instanceof ErrorEvent) {
      console.log('This is a client side error');
      errors = [`Error: ${errorRes.error.message}`];

    } else {
      console.log('This is a server side error');
      if (errorRes.error.response && errorRes.error.response.message){
        errors = Object.values(errorRes.error.response.message);
        
      } else {
        errors = Object.values(errorRes.error);
      }
      
    }
    return errors;
  }



}
