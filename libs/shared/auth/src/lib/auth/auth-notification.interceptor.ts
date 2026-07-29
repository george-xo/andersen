import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, tap, throwError } from 'rxjs';

import { NotificationService } from '@andersen/shared-ui';

import { AUTH_SUCCESS_NOTIFICATION_CONFIG } from './auth-notification.config';
import { AuthErrorBody, AuthResponseBody } from './auth.model';

export const authNotificationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (!(event instanceof HttpResponse)) {
        return;
      }

      const config = AUTH_SUCCESS_NOTIFICATION_CONFIG.find(({ method, urlPart }) => req.method === method && req.url.endsWith(urlPart));

      if (!config) {
        return;
      }

      const body = event.body as AuthResponseBody | null;

      notificationService.success(config.message(body?.email));
    }),
    catchError((error: HttpErrorResponse) => {
      const body = error.error as AuthErrorBody | null;
      const message = body?.error ?? body?.message ?? 'Something went wrong';

      notificationService.error(message);

      return throwError(() => error);
    }),
  );
};
