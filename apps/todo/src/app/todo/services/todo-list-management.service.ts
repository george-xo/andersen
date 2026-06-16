import { Injectable } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';

import { ITodo } from '../core/todo.models';
import { TodoManagementService } from './todo-management.service';

@Injectable({
  providedIn: 'root',
})
export class TodoListManagementService extends TodoManagementService {
  public addTodo(name: string): Observable<ITodo[]> {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return EMPTY;
    }

    return this.mutateAndReloadTodos(
      this.todoApiService.createTodo({
        name: normalizedName,
      }),
    );
  }

  public deleteTodo(todoId: string): Observable<ITodo[]> {
    return this.mutateAndReloadTodos(this.todoApiService.deleteTodo(todoId));
  }
}
