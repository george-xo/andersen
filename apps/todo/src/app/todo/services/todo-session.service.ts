import { Injectable, signal } from '@angular/core';

import { AuthTokenStorage } from '@andersen/auth';

@Injectable({
  providedIn: 'root',
})
export class TodoSessionService implements AuthTokenStorage {
  private readonly token = signal<string | null>(null);

  public setToken(token: string): void {
    this.token.set(token);
  }

  public getToken(): string | null {
    return this.token();
  }

  public clearToken(): void {
    this.token.set(null);
  }
}
