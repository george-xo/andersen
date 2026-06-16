import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const USERNAME_VALIDATORS = [Validators.required, Validators.minLength(8), Validators.pattern(/^[A-Za-z0-9]+$/)];

export const EMAIL_VALIDATORS = [Validators.required, Validators.email];

export const PASSWORD_POLICY_ERROR_KEY = 'passwordPolicy';

export const PASSWORD_VALIDATORS = [Validators.required, passwordPolicyValidator];

export const SIGN_IN_PASSWORD_VALIDATORS = [Validators.required, Validators.minLength(8)];

export function passwordPolicyValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;

  if (!value) {
    return null;
  }

  const hasMinimumLength = value.length >= 8;
  const uppercaseCount = (value.match(/[A-Z]/g) ?? []).length;
  const hasEnoughUppercaseLetters = uppercaseCount >= 2;
  const hasNumber = /\d/.test(value);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value);

  return hasMinimumLength && hasEnoughUppercaseLetters && hasNumber && hasSpecialCharacter ? null : { [PASSWORD_POLICY_ERROR_KEY]: true };
}

export function passwordsMatchValidator(passwordControlName: string, repeatPasswordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName)?.value;
    const repeatPassword = control.get(repeatPasswordControlName)?.value;

    if (!password || !repeatPassword) {
      return null;
    }

    return password === repeatPassword ? null : { passwordMismatch: true };
  };
}
