import { inject } from '@angular/core';

import { Observable, switchMap } from 'rxjs';

import { ITodo } from '../core/todo.models';
import { TodoApiService } from './todo-api.service';

export abstract class TodoManagementService {
  protected readonly todoApiService = inject(TodoApiService);

  public loadTodos(): Observable<ITodo[]> {
    return this.todoApiService.getTodos();
  }

  protected mutateAndReloadTodos<T>(mutation$: Observable<T>): Observable<ITodo[]> {
    return mutation$.pipe(switchMap(() => this.loadTodos()));
  }

  protected normalizeName(name: string): string | null {
    const normalizedName = name.trim();

    return normalizedName || null;
  }
}
