import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo } from '../core/todo.models';
import { TodoListCardComponent } from './todo-list-card.component';

const TODO_ID = 'todo-123';
const TASK_ID = 'task-123';
const TASK_NAME = 'Task 1';
const UPDATED_TASK_NAME = 'Updated task';

const TODO: ITodo = {
  id: TODO_ID,
  name: 'Work',
  tasks: [],
};

describe('TodoListCardComponent', () => {
  let fixture: ComponentFixture<TodoListCardComponent>;
  let component: TodoListCardComponent;

  const formGroupDirectiveMock = {
    resetForm: vi.fn(),
  } as unknown as FormGroupDirective;

  beforeEach(async () => {
    vi.resetAllMocks();

    await TestBed.configureTestingModule({
      imports: [TodoListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('todo', TODO);
    fixture.detectChanges();
  });

  const setValidTaskForm = (): void => {
    component['taskForm'].setValue({
      name: TASK_NAME,
    });
  };

  it('should emit add task payload', () => {
    const emitSpy = vi.spyOn(component.addTask, 'emit');
    setValidTaskForm();

    component['onAddTask'](formGroupDirectiveMock);

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith({
      todoId: TODO_ID,
      name: TASK_NAME,
    });
  });

  it('should reset form after adding task', () => {
    setValidTaskForm();

    component['onAddTask'](formGroupDirectiveMock);

    expect(formGroupDirectiveMock.resetForm).toHaveBeenCalledExactlyOnceWith({ name: '' });
  });

  it('should not emit add task when form is invalid', () => {
    const emitSpy = vi.spyOn(component.addTask, 'emit');

    component['onAddTask'](formGroupDirectiveMock);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit add task while loading', () => {
    const emitSpy = vi.spyOn(component.addTask, 'emit');
    fixture.componentRef.setInput('isLoading', true);
    setValidTaskForm();

    component['onAddTask'](formGroupDirectiveMock);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit delete todo id', () => {
    const emitSpy = vi.spyOn(component.deleteTodo, 'emit');

    component['onDeleteTodo']();

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(TODO_ID);
  });

  it('should emit delete task payload', () => {
    const emitSpy = vi.spyOn(component.deleteTask, 'emit');

    component['onDeleteTask'](TASK_ID);

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith({
      todoId: TODO_ID,
      taskId: TASK_ID,
    });
  });

  it('should emit toggle task payload', () => {
    const emitSpy = vi.spyOn(component.toggleTaskCompleted, 'emit');

    component['onToggleTaskCompleted'](TASK_ID);

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith({
      todoId: TODO_ID,
      taskId: TASK_ID,
    });
  });

  it('should emit update task payload', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');

    component['onUpdateTask']({
      taskId: TASK_ID,
      name: UPDATED_TASK_NAME,
    });

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith({
      todoId: TODO_ID,
      taskId: TASK_ID,
      name: UPDATED_TASK_NAME,
    });
  });
});
