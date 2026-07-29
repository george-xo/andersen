import { Provider } from '@angular/core';

import { AUTH_TOKEN_STORAGE, AuthTokenStorageService } from '@andersen/auth';

export const AUTH_PROVIDERS: Provider[] = [
  {
    provide: AUTH_TOKEN_STORAGE,
    useExisting: AuthTokenStorageService,
  },
];
