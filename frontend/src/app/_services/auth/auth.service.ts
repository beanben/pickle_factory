import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _tokenService: TokenStorageService,
  ) { }

  isLoggedIn(): boolean {
    return !!this._tokenService.getAccessToken();
  }

}
