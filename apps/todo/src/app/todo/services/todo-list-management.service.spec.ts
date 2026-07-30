import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo } from '../core/todo.models';
import { TodoApiService } from './todo-api.service';
import { TodoListManagementService } from './todo-list-management.service';

const TODO_ID = 'todo-123';
const TODO_NAME = 'Work';

const TODO: ITodo = {
  id: TODO_ID,
  name: TODO_NAME,
  tasks: [],
};

describe('TodoListManagementService', () => {
  let service: TodoListManagementService;

  const todoApiServiceMock = {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    deleteTodo: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    TestBed.configureTestingModule({
      providers: [
        TodoListManagementService,
        {
          provide: TodoApiService,
          useValue: todoApiServiceMock,
        },
      ],
    });

    service = TestBed.inject(TodoListManagementService);
  });

  const mockFreshTodos = (): void => {
    todoApiServiceMock.getTodos.mockReturnValue(of([TODO]));
  };

  const mockSuccessfulTodoCreation = (): void => {
    todoApiServiceMock.createTodo.mockReturnValue(of(TODO));
    mockFreshTodos();
  };

  const mockSuccessfulTodoDeletion = (): void => {
    todoApiServiceMock.deleteTodo.mockReturnValue(of({ deleted: true }));
    mockFreshTodos();
  };

  it('should load todos from api', () => {
    mockFreshTodos();

    service.loadTodos().subscribe();

    expect(todoApiServiceMock.getTodos).toHaveBeenCalledTimes(1);
  });

  it('should create todo with normalized name', () => {
    mockSuccessfulTodoCreation();

    service.addTodo(` ${TODO_NAME} `).subscribe();

    expect(todoApiServiceMock.createTodo).toHaveBeenCalledExactlyOnceWith({
      name: TODO_NAME,
    });
  });

  it('should reload todos after creating todo', () => {
    mockSuccessfulTodoCreation();

    service.addTodo(TODO_NAME).subscribe();

    expect(todoApiServiceMock.getTodos).toHaveBeenCalledTimes(1);
  });

  it('should not create todo when name is empty', () => {
    todoApiServiceMock.createTodo.mockReturnValue(EMPTY);

    service.addTodo('   ').subscribe();

    expect(todoApiServiceMock.createTodo).not.toHaveBeenCalled();
  });

  it('should delete todo by id', () => {
    mockSuccessfulTodoDeletion();

    service.deleteTodo(TODO_ID).subscribe();

    expect(todoApiServiceMock.deleteTodo).toHaveBeenCalledExactlyOnceWith(TODO_ID);
  });

  it('should reload todos after deleting todo', () => {
    mockSuccessfulTodoDeletion();

    service.deleteTodo(TODO_ID).subscribe();

    expect(todoApiServiceMock.getTodos).toHaveBeenCalledTimes(1);
  });
});
