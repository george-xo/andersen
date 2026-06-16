import { Injectable, inject } from '@angular/core';

import { NotificationService } from '@andersen/shared-ui';

import { MonoTypeOperatorFunction, Observable, catchError, pipe, tap, throwError } from 'rxjs';

import { ITodo, ITodoTask, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from '../core/todo.models';
import { TodoListManagementService } from './todo-list-management.service';
import { TodoTaskManagementService } from './todo-task-management.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly notificationService = inject(NotificationService);
  private readonly todoListManagementService = inject(TodoListManagementService);
  private readonly todoTaskManagementService = inject(TodoTaskManagementService);

  public loadTodos(): Observable<ITodo[]> {
    return this.todoListManagementService.loadTodos().pipe(this.notificationErrorOperator('Failed to load todos'));
  }

  public addTodo(name: string): Observable<ITodo[]> {
    return this.todoListManagementService.addTodo(name).pipe(this.notify('Todo added successfully', 'Failed to add todo'));
  }

  public deleteTodo(todoId: string): Observable<ITodo[]> {
    return this.todoListManagementService.deleteTodo(todoId).pipe(this.notify('Todo deleted successfully', 'Failed to delete todo'));
  }

  public addTask(event: ITodoTaskNameEvent): Observable<ITodo[]> {
    return this.todoTaskManagementService.addTask(event).pipe(this.notificationErrorOperator('Failed to add task'));
  }

  public deleteTask(event: ITodoTaskTargetEvent): Observable<ITodo[]> {
    return this.todoTaskManagementService.deleteTask(event).pipe(this.notify('Task deleted successfully', 'Failed to delete task'));
  }

  public toggleTaskCompleted(event: ITodoTaskTargetEvent, task: ITodoTask): Observable<ITodo[]> {
    return this.todoTaskManagementService.toggleTaskCompleted(event, task).pipe(this.notificationErrorOperator('Failed to update task'));
  }

  public updateTaskName(event: ITodoTaskFullEvent, task: ITodoTask): Observable<ITodo[]> {
    return this.todoTaskManagementService
      .updateTaskName(event, task)
      .pipe(this.notify('Task updated successfully', 'Failed to update task'));
  }

  private notificationSuccessOperator<T>(message: string): MonoTypeOperatorFunction<T> {
    return tap(() => {
      this.notificationService.success(message);
    });
  }

  private notificationErrorOperator<T>(message: string): MonoTypeOperatorFunction<T> {
    return catchError((error: unknown) => {
      this.notificationService.error(message);

      return throwError(() => error);
    });
  }

  private notify<T>(successMessage: string, errorMessage: string): MonoTypeOperatorFunction<T> {
    return pipe(this.notificationSuccessOperator<T>(successMessage), this.notificationErrorOperator<T>(errorMessage));
  }
}
