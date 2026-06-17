import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodoTask } from '../core/todo.models';
import { TodoTaskItemComponent } from './todo-task-item.component';

const TASK_ID = 'task-123';
const TASK_NAME = 'Task 1';
const UPDATED_TASK_NAME = 'Updated task';

const TASK: ITodoTask = {
  id: TASK_ID,
  name: TASK_NAME,
  completed: false,
};

describe('TodoTaskItemComponent', () => {
  let fixture: ComponentFixture<TodoTaskItemComponent>;
  let component: TodoTaskItemComponent;

  beforeEach(async () => {
    vi.resetAllMocks();

    await TestBed.configureTestingModule({
      imports: [TodoTaskItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoTaskItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', TASK);
    fixture.detectChanges();
  });

  const setValidEditForm = (): void => {
    component['editForm'].setValue({
      name: UPDATED_TASK_NAME,
    });
  };

  it('should emit delete task id', () => {
    const emitSpy = vi.spyOn(component.deleteTask, 'emit');

    component['onDeleteTask']();

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(TASK_ID);
  });

  it('should emit completed change task id', () => {
    const emitSpy = vi.spyOn(component.completedChange, 'emit');

    component['onCompletedChange']();

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith(TASK_ID);
  });

  it('should enable edit mode', () => {
    component['startEdit']();

    expect(component['isEditing']()).toBe(true);
  });

  it('should set current task name when editing starts', () => {
    component['startEdit']();

    expect(component['editForm'].controls.name.value).toBe(TASK_NAME);
  });

  it('should emit update task payload', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');
    setValidEditForm();

    component['saveEdit']();

    expect(emitSpy).toHaveBeenCalledExactlyOnceWith({
      taskId: TASK_ID,
      name: UPDATED_TASK_NAME,
    });
  });

  it('should disable edit mode after saving', () => {
    setValidEditForm();
    component['isEditing'].set(true);

    component['saveEdit']();

    expect(component['isEditing']()).toBe(false);
  });

  it('should not emit update task when form is invalid', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');

    component['saveEdit']();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit update task while loading', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');
    fixture.componentRef.setInput('isLoading', true);
    setValidEditForm();

    component['saveEdit']();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should disable edit mode after cancelling', () => {
    component['isEditing'].set(true);

    component['cancelEdit']();

    expect(component['isEditing']()).toBe(false);
  });
});
