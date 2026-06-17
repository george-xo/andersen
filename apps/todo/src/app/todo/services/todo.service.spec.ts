import { TestBed } from '@angular/core/testing';

import { NotificationService } from '@andersen/shared-ui';

import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo, ITodoTask, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from '../core/todo.models';
import { TodoListManagementService } from './todo-list-management.service';
import { TodoService } from './todo.service';
import { TodoTaskManagementService } from './todo-task-management.service';

const TODO_ID = 'todo-123';
const TASK_ID = 'task-123';
const TODO_NAME = 'Work';
const TASK_NAME = 'Task 1';
const UPDATED_TASK_NAME = 'Updated task';

const TASK: ITodoTask = {
  id: TASK_ID,
  name: TASK_NAME,
  completed: false,
};

const TODO: ITodo = {
  id: TODO_ID,
  name: TODO_NAME,
  tasks: [TASK],
};

const TASK_NAME_EVENT: ITodoTaskNameEvent = {
  todoId: TODO_ID,
  name: TASK_NAME,
};

const TASK_TARGET_EVENT: ITodoTaskTargetEvent = {
  todoId: TODO_ID,
  taskId: TASK_ID,
};

const TASK_UPDATE_EVENT: ITodoTaskFullEvent = {
  ...TASK_TARGET_EVENT,
  name: UPDATED_TASK_NAME,
};

describe('TodoService', () => {
  let service: TodoService;

  const todoListManagementServiceMock = {
    loadTodos: vi.fn(),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
  };

  const todoTaskManagementServiceMock = {
    addTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompleted: vi.fn(),
    updateTaskName: vi.fn(),
  };

  const notificationServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoListManagementService,
          useValue: todoListManagementServiceMock,
        },
        {
          provide: TodoTaskManagementService,
          useValue: todoTaskManagementServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
      ],
    });

    service = TestBed.inject(TodoService);
  });

  const mockSuccessfulListRequest = (): void => {
    todoListManagementServiceMock.loadTodos.mockReturnValue(of([TODO]));
    todoListManagementServiceMock.addTodo.mockReturnValue(of([TODO]));
    todoListManagementServiceMock.deleteTodo.mockReturnValue(of([TODO]));
  };

  const mockSuccessfulTaskRequest = (): void => {
    todoTaskManagementServiceMock.addTask.mockReturnValue(of([TODO]));
    todoTaskManagementServiceMock.deleteTask.mockReturnValue(of([TODO]));
    todoTaskManagementServiceMock.toggleTaskCompleted.mockReturnValue(of([TODO]));
    todoTaskManagementServiceMock.updateTaskName.mockReturnValue(of([TODO]));
  };

  it('should load todos through list management service', () => {
    mockSuccessfulListRequest();

    service.loadTodos().subscribe();

    expect(todoListManagementServiceMock.loadTodos).toHaveBeenCalledTimes(1);
  });

  it('should add todo through list management service', () => {
    mockSuccessfulListRequest();

    service.addTodo(TODO_NAME).subscribe();

    expect(todoListManagementServiceMock.addTodo).toHaveBeenCalledExactlyOnceWith(TODO_NAME);
  });

  it('should show success notification after adding todo', () => {
    mockSuccessfulListRequest();

    service.addTodo(TODO_NAME).subscribe();

    expect(notificationServiceMock.success).toHaveBeenCalledExactlyOnceWith('Todo added successfully');
  });

  it('should delete todo through list management service', () => {
    mockSuccessfulListRequest();

    service.deleteTodo(TODO_ID).subscribe();

    expect(todoListManagementServiceMock.deleteTodo).toHaveBeenCalledExactlyOnceWith(TODO_ID);
  });

  it('should add task through task management service', () => {
    mockSuccessfulTaskRequest();

    service.addTask(TASK_NAME_EVENT).subscribe();

    expect(todoTaskManagementServiceMock.addTask).toHaveBeenCalledExactlyOnceWith(TASK_NAME_EVENT);
  });

  it('should delete task through task management service', () => {
    mockSuccessfulTaskRequest();

    service.deleteTask(TASK_TARGET_EVENT).subscribe();

    expect(todoTaskManagementServiceMock.deleteTask).toHaveBeenCalledExactlyOnceWith(TASK_TARGET_EVENT);
  });

  it('should toggle task through task management service', () => {
    mockSuccessfulTaskRequest();

    service.toggleTaskCompleted(TASK_TARGET_EVENT, TASK).subscribe();

    expect(todoTaskManagementServiceMock.toggleTaskCompleted).toHaveBeenCalledExactlyOnceWith(TASK_TARGET_EVENT, TASK);
  });

  it('should update task through task management service', () => {
    mockSuccessfulTaskRequest();

    service.updateTaskName(TASK_UPDATE_EVENT, TASK).subscribe();

    expect(todoTaskManagementServiceMock.updateTaskName).toHaveBeenCalledExactlyOnceWith(TASK_UPDATE_EVENT, TASK);
  });

  it('should show error notification when request fails', () => {
    todoListManagementServiceMock.addTodo.mockReturnValue(throwError(() => new Error('Request failed')));

    service.addTodo(TODO_NAME).subscribe({
      error: () => undefined,
    });

    expect(notificationServiceMock.error).toHaveBeenCalledExactlyOnceWith('Failed to add todo');
  });

  it('should not show success notification when request fails', () => {
    todoListManagementServiceMock.addTodo.mockReturnValue(throwError(() => new Error('Request failed')));

    service.addTodo(TODO_NAME).subscribe({
      error: () => undefined,
    });

    expect(notificationServiceMock.success).not.toHaveBeenCalled();
  });
});
