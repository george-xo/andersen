import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AUTH_TOKEN_HEADER } from '@andersen/auth';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { TodoApiService } from './todo-api.service';

const TODO_ID = 'todo-123';
const TASK_ID = 'task-123';
const TODO_NAME = 'Work';
const TASK_NAME = 'Task 1';

const TODO_URL = `${environment.todoApiBaseUrl}/todo`;
const TASK_URL = `${environment.todoApiBaseUrl}/todo/task`;
const EDIT_TASK_URL = `${environment.todoApiBaseUrl}/todo/edit-task`;

describe('TodoApiService', () => {
  let service: TodoApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const expectGetTodosRequest = () => {
    service.getTodos().subscribe();

    return httpTestingController.expectOne(TODO_URL);
  };

  const expectCreateTodoRequest = () => {
    service.createTodo({ name: TODO_NAME }).subscribe();

    return httpTestingController.expectOne(TODO_URL);
  };

  const expectDeleteTodoRequest = () => {
    service.deleteTodo(TODO_ID).subscribe();

    return httpTestingController.expectOne((request) => request.url === TODO_URL && request.params.get('id') === TODO_ID);
  };

  const expectCreateTaskRequest = () => {
    service.createTask(TODO_ID, { name: TASK_NAME }).subscribe();

    return httpTestingController.expectOne((request) => request.url === TASK_URL && request.params.get('id') === TODO_ID);
  };

  const expectUpdateTaskRequest = () => {
    service
      .updateTask(TODO_ID, TASK_ID, {
        name: TASK_NAME,
        completed: true,
      })
      .subscribe();

    return httpTestingController.expectOne(
      (request) => request.url === EDIT_TASK_URL && request.params.get('id') === TODO_ID && request.params.get('task-id') === TASK_ID,
    );
  };

  const expectDeleteTaskRequest = () => {
    service.deleteTask(TODO_ID, TASK_ID).subscribe();

    return httpTestingController.expectOne(
      (request) => request.url === TASK_URL && request.params.get('id') === TODO_ID && request.params.get('task-id') === TASK_ID,
    );
  };

  it('should get todos with get method', () => {
    const request = expectGetTodosRequest();

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });

  it('should not set auth token header directly', () => {
    const request = expectGetTodosRequest();

    expect(request.request.headers.has(AUTH_TOKEN_HEADER)).toBe(false);

    request.flush([]);
  });

  it('should create todo with post method', () => {
    const request = expectCreateTodoRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });

  it('should create todo with name payload', () => {
    const request = expectCreateTodoRequest();

    expect(request.request.body).toEqual({
      name: TODO_NAME,
    });

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });

  it('should delete todo with delete method', () => {
    const request = expectDeleteTodoRequest();

    expect(request.request.method).toBe('DELETE');

    request.flush({ deleted: true });
  });

  it('should create task with post method', () => {
    const request = expectCreateTaskRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });

  it('should create task with name payload', () => {
    const request = expectCreateTaskRequest();

    expect(request.request.body).toEqual({
      name: TASK_NAME,
    });

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });

  it('should update task with post method', () => {
    const request = expectUpdateTaskRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });

  it('should update task with task payload', () => {
    const request = expectUpdateTaskRequest();

    expect(request.request.body).toEqual({
      name: TASK_NAME,
      completed: true,
    });

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });

  it('should delete task with delete method', () => {
    const request = expectDeleteTaskRequest();

    expect(request.request.method).toBe('DELETE');

    request.flush({ id: TODO_ID, name: TODO_NAME, tasks: [] });
  });
});
