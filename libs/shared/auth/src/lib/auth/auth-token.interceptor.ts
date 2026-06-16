import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { AUTH_TOKEN_RESPONSE_CONFIG } from './auth-token.config';
import { AUTH_TOKEN_HEADER, AUTH_TOKEN_STORAGE } from './auth.model';

export const authTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenStorage = inject(AUTH_TOKEN_STORAGE);
  const token = tokenStorage.getToken();

  const authReq = token
    ? req.clone({
        setHeaders: {
          [AUTH_TOKEN_HEADER]: token,
        },
      })
    : req;

  return next(authReq).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (!(event instanceof HttpResponse)) {
        return;
      }

      const shouldReadToken = AUTH_TOKEN_RESPONSE_CONFIG.some(({ method, urlPart }) => req.method === method && req.url.endsWith(urlPart));

      if (!shouldReadToken) {
        return;
      }

      const responseToken = event.headers.get(AUTH_TOKEN_HEADER);

      if (responseToken) {
        tokenStorage.setToken(responseToken);
      }
    }),
  );
};
