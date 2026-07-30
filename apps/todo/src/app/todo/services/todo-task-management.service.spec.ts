import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo, ITodoTask } from '../core/todo.models';
import { TodoApiService } from './todo-api.service';
import { TodoTaskManagementService } from './todo-task-management.service';

const TODO_ID = 'todo-123';
const TASK_ID = 'task-123';
const TASK_NAME = 'Task 1';
const UPDATED_TASK_NAME = 'Updated task';

const TASK: ITodoTask = {
  id: TASK_ID,
  name: TASK_NAME,
  completed: false,
};

const TODO: ITodo = {
  id: TODO_ID,
  name: 'Work',
  tasks: [TASK],
};

describe('TodoTaskManagementService', () => {
  let service: TodoTaskManagementService;

  const todoApiServiceMock = {
    getTodos: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    updateTask: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    TestBed.configureTestingModule({
      providers: [
        TodoTaskManagementService,
        {
          provide: TodoApiService,
          useValue: todoApiServiceMock,
        },
      ],
    });

    service = TestBed.inject(TodoTaskManagementService);
  });

  const mockFreshTodos = (): void => {
    todoApiServiceMock.getTodos.mockReturnValue(of([TODO]));
  };

  const mockSuccessfulTaskCreation = (): void => {
    todoApiServiceMock.createTask.mockReturnValue(of(TODO));
    mockFreshTodos();
  };

  const mockSuccessfulTaskDeletion = (): void => {
    todoApiServiceMock.deleteTask.mockReturnValue(of(TODO));
    mockFreshTodos();
  };

  const mockSuccessfulTaskUpdate = (): void => {
    todoApiServiceMock.updateTask.mockReturnValue(of(TODO));
    mockFreshTodos();
  };

  it('should create task with normalized name', () => {
    mockSuccessfulTaskCreation();

    service
      .addTask({
        todoId: TODO_ID,
        name: ` ${TASK_NAME} `,
      })
      .subscribe();

    expect(todoApiServiceMock.createTask).toHaveBeenCalledExactlyOnceWith(TODO_ID, {
      name: TASK_NAME,
    });
  });

  it('should reload todos after creating task', () => {
    mockSuccessfulTaskCreation();

    service
      .addTask({
        todoId: TODO_ID,
        name: TASK_NAME,
      })
      .subscribe();

    expect(todoApiServiceMock.getTodos).toHaveBeenCalledTimes(1);
  });

  it('should not create task when name is empty', () => {
    service
      .addTask({
        todoId: TODO_ID,
        name: '   ',
      })
      .subscribe();

    expect(todoApiServiceMock.createTask).not.toHaveBeenCalled();
  });

  it('should delete task with todo and task ids', () => {
    mockSuccessfulTaskDeletion();

    service
      .deleteTask({
        todoId: TODO_ID,
        taskId: TASK_ID,
      })
      .subscribe();

    expect(todoApiServiceMock.deleteTask).toHaveBeenCalledExactlyOnceWith(TODO_ID, TASK_ID);
  });

  it('should toggle task completed value', () => {
    mockSuccessfulTaskUpdate();

    service
      .toggleTaskCompleted(
        {
          todoId: TODO_ID,
          taskId: TASK_ID,
        },
        TASK,
      )
      .subscribe();

    expect(todoApiServiceMock.updateTask).toHaveBeenCalledExactlyOnceWith(TODO_ID, TASK_ID, {
      name: TASK_NAME,
      completed: true,
    });
  });

  it('should update task witzz alized name', () => {
    mockSuccessfulTaskUpdate();

    service
      .updateTaskName(
        {
          todoId: TODO_ID,
          taskId: TASK_ID,
          name: ` ${UPDATED_TASK_NAME} `,
        },
        TASK,
      )
      .subscribe();

    expect(todoApiServiceMock.updateTask).toHaveBeenCalledExactlyOnceWith(TODO_ID, TASK_ID, {
      name: UPDATED_TASK_NAME,
      completed: false,
    });
  });

  it('should not update task when name is empty', () => {
    service
      .updateTaskName(
        {
          todoId: TODO_ID,
          taskId: TASK_ID,
          name: '   ',
        },
        TASK,
      )
      .subscribe();

    expect(todoApiServiceMock.updateTask).not.toHaveBeenCalled();
  });
});
