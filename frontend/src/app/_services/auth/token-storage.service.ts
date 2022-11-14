import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'auth-token-access';
const REFRESH_TOKEN_KEY = 'auth-token-refresh';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public saveRefreshToken(refresh_token: string): void {
    this.deleteRefreshToken();
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  }
  public getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  public deleteRefreshToken(): void {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  public saveAccessToken(access_token: string): void {
    this.deleteAccessToken();
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  }
  public getAccessToken(): string | null {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  public deleteAccessToken(): void {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

}
