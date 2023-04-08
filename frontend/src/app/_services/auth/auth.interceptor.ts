import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _tokenService: TokenStorageService,
    private _authService: AuthService,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._tokenService.getAccessToken();

    if (token) {
      req = this.addTokenHeader(req, token);
    };

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !req.url.includes('refresh')) {
          return this.handleError(req, next);
        }
        this._authService.logout();
        return throwError(() => err);
      })
    )
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });
  }

  private handleError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this._tokenService.getRefreshToken();

    if (!refreshToken) {
      this._authService.logout();
      return throwError(() => new HttpErrorResponse({ error: 'Refresh token not found', status: 401 }));
    }

    return this._authService.refreshToken(refreshToken).pipe(
      switchMap((token: any) => {
        this._tokenService.saveAccessToken(token.access);
        const authReq = this.addTokenHeader(req, token.access);
        return next.handle(authReq)
      }),
      catchError((err: HttpErrorResponse) => {
        this._authService.logout();
        return throwError(() => err);
      }),
    )
  }

}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
