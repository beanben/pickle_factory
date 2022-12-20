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
    ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this._tokenService.getAccessToken();

    if (!!token) {
      authReq = this.addTokenHeader(req, token);
    };

    return next.handle(authReq)
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse && err.status === 401 && !authReq.url.includes('refresh')) {
            return this.handleError(authReq, next);

          } else {
            this._authService.logout();
            return throwError(() => err);

          }
        })

      )
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {'Authorization': `Bearer ${token}`}
    });
  }

  private handleError(req: HttpRequest<any>, next: HttpHandler) {
    const token = this._tokenService.getRefreshToken();
    if(token) {
      return this._authService.refreshToken(token)
        .pipe(
          switchMap((token:any) => {
            this._tokenService.saveAccessToken(token.access);
            const authReq = this.addTokenHeader(req, token.access);
            return next.handle(authReq)
          })
        )

    } else {
      return next.handle(req)
    }
  }

}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
