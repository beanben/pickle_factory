import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Firm } from 'src/app/pages/auth/firm';
import { Router } from '@angular/router';

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

  isLoggedIn(): boolean {
    return !!this._tokenService.getAccessToken();
  }



}
