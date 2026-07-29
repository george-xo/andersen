import { Injectable } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';

import { ITodo, ITodoTask, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from '../core/todo.models';
import { TodoManagementService } from './todo-management.service';

@Injectable({
  providedIn: 'root',
})
export class TodoTaskManagementService extends TodoManagementService {
  public addTask({ todoId, name }: ITodoTaskNameEvent): Observable<ITodo[]> {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return EMPTY;
    }

    return this.mutateAndReloadTodos(
      this.todoApiService.createTask(todoId, {
        name: normalizedName,
      }),
    );
  }

  public deleteTask({ todoId, taskId }: ITodoTaskTargetEvent): Observable<ITodo[]> {
    return this.mutateAndReloadTodos(this.todoApiService.deleteTask(todoId, taskId));
  }

  public toggleTaskCompleted({ todoId, taskId }: ITodoTaskTargetEvent, task: ITodoTask): Observable<ITodo[]> {
    return this.updateTask(todoId, taskId, {
      name: task.name,
      completed: !task.completed,
    });
  }

  public updateTaskName({ todoId, taskId, name }: ITodoTaskFullEvent, task: ITodoTask): Observable<ITodo[]> {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return EMPTY;
    }

    return this.updateTask(todoId, taskId, {
      name: normalizedName,
      completed: task.completed,
    });
  }

  private updateTask(todoId: string, taskId: string, payload: { name: string; completed: boolean }): Observable<ITodo[]> {
    return this.mutateAndReloadTodos(this.todoApiService.updateTask(todoId, taskId, payload));
  }
}
