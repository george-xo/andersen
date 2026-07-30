import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';

import { UiDialogService } from '@andersen/shared-ui';

import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo, ITodoTask } from './core/todo.models';
import { TodoService } from './services/todo.service';
import { TodoSessionService } from './services/todo-session.service';
import { TodoComponent } from './todo.component';

const TODO_ID = 'todo-123';
const TASK_ID = 'task-123';
const TODO_NAME = 'Work';
const TASK_NAME = 'Task 1';

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

describe('TodoComponent', () => {
  let fixture: ComponentFixture<TodoComponent>;
  let component: TodoComponent;

  const todoServiceMock = {
    loadTodos: vi.fn(),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    addTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompleted: vi.fn(),
    updateTaskName: vi.fn(),
  };

  const todoSessionServiceMock = {
    setToken: vi.fn(),
  };

  const dialogServiceMock = {
    open: vi.fn(),
  };

  const formGroupDirectiveMock = {
    resetForm: vi.fn(),
  } as unknown as FormGroupDirective;

  beforeEach(async () => {
    vi.resetAllMocks();

    todoServiceMock.loadTodos.mockReturnValue(of([TODO]));
    todoServiceMock.addTodo.mockReturnValue(of([TODO]));
    todoServiceMock.deleteTodo.mockReturnValue(of([TODO]));
    todoServiceMock.addTask.mockReturnValue(of([TODO]));
    todoServiceMock.deleteTask.mockReturnValue(of([TODO]));
    todoServiceMock.toggleTaskCompleted.mockReturnValue(of([TODO]));
    todoServiceMock.updateTaskName.mockReturnValue(of([TODO]));
    dialogServiceMock.open.mockReturnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        {
          provide: TodoService,
          useValue: todoServiceMock,
        },
        {
          provide: TodoSessionService,
          useValue: todoSessionServiceMock,
        },
        {
          provide: UiDialogService,
          useValue: dialogServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setValidTodoForm = (): void => {
    component['todoForm'].setValue({
      name: TODO_NAME,
    });
  };

  it('should load todos on init', () => {
    expect(todoServiceMock.loadTodos).toHaveBeenCalledTimes(1);
  });

  it('should store loaded todos', () => {
    expect(component['todos']()).toEqual([TODO]);
  });

  it('should set todo session token on init', () => {
    expect(todoSessionServiceMock.setToken).toHaveBeenCalledTimes(1);
  });

  it('should not add todo when form is invalid', () => {
    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
  });

  it('should add todo with form value', () => {
    setValidTodoForm();

    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).toHaveBeenCalledExactlyOnceWith(TODO_NAME);
  });

  it('should reset form after adding todo', () => {
    setValidTodoForm();

    component['addTodo'](formGroupDirectiveMock);

    expect(formGroupDirectiveMock.resetForm).toHaveBeenCalledExactlyOnceWith({ name: '' });
  });

  it('should not add todo while request is pending', () => {
    component['isAddTodoPending'].set(true);
    setValidTodoForm();

    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
  });

  it('should delete todo when dialog is confirmed', () => {
    component['deleteTodo'](TODO_ID);

    expect(todoServiceMock.deleteTodo).toHaveBeenCalledExactlyOnceWith(TODO_ID);
  });

  it('should not delete todo when dialog is cancelled', () => {
    dialogServiceMock.open.mockReturnValue(of(false));

    component['deleteTodo'](TODO_ID);

    expect(todoServiceMock.deleteTodo).not.toHaveBeenCalled();
  });

  it('should add task with event payload', () => {
    const event = {
      todoId: TODO_ID,
      name: TASK_NAME,
    };

    component['addTask'](event);

    expect(todoServiceMock.addTask).toHaveBeenCalledExactlyOnceWith(event);
  });

  it('should not add task while todo action is loading', () => {
    component['loadingTodoId'].set(TODO_ID);

    component['addTask']({
      todoId: TODO_ID,
      name: TASK_NAME,
    });

    expect(todoServiceMock.addTask).not.toHaveBeenCalled();
  });

  it('should toggle existing task', () => {
    const event = {
      todoId: TODO_ID,
      taskId: TASK_ID,
    };

    component['toggleTaskCompleted'](event);

    expect(todoServiceMock.toggleTaskCompleted).toHaveBeenCalledExactlyOnceWith(event, TASK);
  });

  it('should not toggle missing task', () => {
    component['toggleTaskCompleted']({
      todoId: TODO_ID,
      taskId: 'missing-task',
    });

    expect(todoServiceMock.toggleTaskCompleted).not.toHaveBeenCalled();
  });
});
