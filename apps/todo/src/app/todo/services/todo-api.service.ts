import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ICreateTaskPayload, ICreateTodoPayload, ITodoApiItem, IUpdateTaskPayload } from '../core/todo-api.model';

const BASE_API_URL = environment.todoApiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private readonly http = inject(HttpClient);

  public getTodos(): Observable<ITodoApiItem[]> {
    return this.http.get<ITodoApiItem[]>(`${BASE_API_URL}/todo`);
  }

  public createTodo(payload: ICreateTodoPayload): Observable<ITodoApiItem> {
    return this.http.post<ITodoApiItem>(`${BASE_API_URL}/todo`, payload);
  }

  public deleteTodo(todoId: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${BASE_API_URL}/todo`, {
      params: {
        id: todoId,
      },
    });
  }

  public createTask(todoId: string, payload: ICreateTaskPayload): Observable<ITodoApiItem> {
    return this.http.post<ITodoApiItem>(`${BASE_API_URL}/todo/task`, payload, {
      params: {
        id: todoId,
      },
    });
  }

  public updateTask(todoId: string, taskId: string, payload: IUpdateTaskPayload): Observable<ITodoApiItem> {
    return this.http.post<ITodoApiItem>(`${BASE_API_URL}/todo/edit-task`, payload, {
      params: {
        id: todoId,
        'task-id': taskId,
      },
    });
  }

  public deleteTask(todoId: string, taskId: string): Observable<ITodoApiItem> {
    return this.http.delete<ITodoApiItem>(`${BASE_API_URL}/todo/task`, {
      params: {
        id: todoId,
        'task-id': taskId,
      },
    });
  }
}
