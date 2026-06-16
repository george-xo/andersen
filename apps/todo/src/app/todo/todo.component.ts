import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiButtonComponent, UiDialogService, UiInputComponent, UiInputType } from '@andersen/shared-ui';

import { filter, Observable, switchMap } from 'rxjs';

import { DELETE_TASK_DIALOG_DATA, DELETE_TODO_DIALOG_DATA } from './core/todo.constants';
import { ITodo, ITodoTask, ITodoTaskFullEvent, ITodoTaskNameEvent, ITodoTaskTargetEvent } from './core/todo.models';
import { TodoService } from './services/todo.service';
import { TodoSessionService } from './services/todo-session.service';
import { TodoListCardComponent } from './todo-list-card/todo-list-card.component';

const TODO_AUTH_TOKEN = 'REAL_TOKEN_HERE'; // i'll rmeove it whens hell manage apps

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, UiInputComponent, UiButtonComponent, TodoListCardComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly todoSessionService = inject(TodoSessionService);
  private readonly dialogService = inject(UiDialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly todos = signal<ITodo[]>([]);
  protected readonly isAddTodoPending = signal(false);
  protected readonly loadingTodoId = signal<string | null>(null);

  protected readonly uiInputType = UiInputType;

  protected readonly todoForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.todoSessionService.setToken(TODO_AUTH_TOKEN);
    this.loadTodos();
  }

  private loadTodos(): void {
    this.todoService
      .loadTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todos) => {
          this.todos.set(todos);
        },
      });
  }

  protected addTodo(todoFormDirective: FormGroupDirective): void {
    if (this.todoForm.invalid || this.isAddTodoPending()) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const { name } = this.todoForm.getRawValue();

    this.isAddTodoPending.set(true);

    this.todoService
      .addTodo(name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todos) => {
          this.todos.set(todos);
          todoFormDirective.resetForm({ name: '' });
        },
        error: () => {
          this.isAddTodoPending.set(false);
        },
        complete: () => {
          this.isAddTodoPending.set(false);
        },
      });
  }

  protected deleteTodo(todoId: string): void {
    this.runTodoAction(todoId, () =>
      this.dialogService.open(DELETE_TODO_DIALOG_DATA).pipe(
        filter(Boolean),
        switchMap(() => this.todoService.deleteTodo(todoId)),
      ),
    );
  }

  protected addTask(event: ITodoTaskNameEvent): void {
    this.runTodoAction(event.todoId, () => this.todoService.addTask(event));
  }

  protected deleteTask(event: ITodoTaskTargetEvent): void {
    this.runTodoAction(event.todoId, () =>
      this.dialogService.open(DELETE_TASK_DIALOG_DATA).pipe(
        filter(Boolean),
        switchMap(() => this.todoService.deleteTask(event)),
      ),
    );
  }

  protected toggleTaskCompleted(event: ITodoTaskTargetEvent): void {
    const task = this.findTask(event);

    if (!task) {
      return;
    }

    this.runTodoAction(event.todoId, () => this.todoService.toggleTaskCompleted(event, task));
  }

  protected updateTask(event: ITodoTaskFullEvent): void {
    const task = this.findTask(event);

    if (!task) {
      return;
    }

    this.runTodoAction(event.todoId, () => this.todoService.updateTaskName(event, task));
  }

  private runTodoAction(todoId: string, action: () => Observable<ITodo[]>): void {
    if (this.loadingTodoId()) {
      return;
    }

    this.loadingTodoId.set(todoId);

    action()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todos) => {
          this.todos.set(todos);
        },
        error: () => {
          this.loadingTodoId.set(null);
        },
        complete: () => {
          this.loadingTodoId.set(null);
        },
      });
  }

  private findTask({ todoId, taskId }: ITodoTaskTargetEvent): ITodoTask | undefined {
    const todo = this.todos().find(({ id }) => id === todoId);

    return todo?.tasks.find(({ id }) => id === taskId);
  }
}
