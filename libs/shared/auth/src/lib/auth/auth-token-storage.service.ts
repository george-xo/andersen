import { Injectable } from '@angular/core';

import { AuthTokenStorage } from './auth.model';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorageService implements AuthTokenStorage {
  public getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  public setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  public clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}
