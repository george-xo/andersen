import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { authTokenInterceptor } from '@andersen/auth';

import { appRoutes } from './app.routes';
import { TODO_PROVIDERS } from './todo/core/todo.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    ...TODO_PROVIDERS,
  ],
};
