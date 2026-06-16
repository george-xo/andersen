import { Provider } from '@angular/core';

import { AUTH_TOKEN_STORAGE } from '@andersen/auth';

import { TodoSessionService } from '../services/todo-session.service';

export const TODO_PROVIDERS: Provider[] = [
  {
    provide: AUTH_TOKEN_STORAGE,
    useExisting: TodoSessionService,
  },
];
