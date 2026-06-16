import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiButtonPriority, UiButtonType } from './button.model';
import { UiSpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'ui-button',
  imports: [MatButtonModule, UiSpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  public readonly priority = input<UiButtonPriority>('primary');
  public readonly type = input<UiButtonType>('button');
  public readonly disabled = input(false);
  public readonly loading = input(false);
  public readonly pending = input(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.pending());
  protected readonly isLoading = computed(() => this.loading() || this.pending());
}
