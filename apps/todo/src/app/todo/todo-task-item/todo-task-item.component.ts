import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UiButtonComponent, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { ITodoTask, ITodoTaskItemUpdateEvent } from '../core/todo.models';

@Component({
  selector: 'app-todo-task-item',
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, MatCheckboxModule],
  templateUrl: './todo-task-item.component.html',
  styleUrl: './todo-task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTaskItemComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  public readonly task = input.required<ITodoTask>();
  public readonly isLoading = input(false);

  public readonly deleteTask = output<string>();
  public readonly completedChange = output<string>();
  public readonly updateTask = output<ITodoTaskItemUpdateEvent>();

  protected readonly isEditing = signal(false);
  protected readonly uiInputType = UiInputType;

  protected readonly editForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  protected onDeleteTask(): void {
    this.deleteTask.emit(this.task().id);
  }

  protected onCompletedChange(): void {
    this.completedChange.emit(this.task().id);
  }

  protected startEdit(): void {
    this.editForm.controls.name.setValue(this.task().name);
    this.isEditing.set(true);
  }

  protected saveEdit(): void {
    if (this.editForm.invalid || this.isLoading()) {
      this.editForm.markAllAsTouched();
      return;
    }

    const { name } = this.editForm.getRawValue();

    this.updateTask.emit({
      taskId: this.task().id,
      name,
    });

    this.isEditing.set(false);
  }

  protected cancelEdit(): void {
    this.editForm.reset();
    this.editForm.controls.name.setErrors(null);
    this.isEditing.set(false);
  }
}
