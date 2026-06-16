import { UiInputType, UiPasswordVisibilityConfig, UiPasswordVisibilityIconType, UiPasswordVisibilityState } from './input.model';

export const PASSWORD_VISIBILITY_SVG_ICON_PATH = {
  Lock: '/assets/icons/lock.svg',
  Unlock: '/assets/icons/unlock.svg',
} as const;

export const DEFAULT_PASSWORD_VISIBILITY_CONFIG: UiPasswordVisibilityConfig = {
  [UiPasswordVisibilityState.Hidden]: {
    type: UiInputType.Password,
    icon: 'visibility_off',
    iconType: UiPasswordVisibilityIconType.Material,
    ariaLabel: 'Show password',
  },
  [UiPasswordVisibilityState.Visible]: {
    type: UiInputType.Text,
    icon: 'visibility',
    iconType: UiPasswordVisibilityIconType.Material,
    ariaLabel: 'Hide password',
  },
};

export const LOCK_PASSWORD_VISIBILITY_CONFIG: UiPasswordVisibilityConfig = {
  [UiPasswordVisibilityState.Hidden]: {
    type: UiInputType.Password,
    icon: PASSWORD_VISIBILITY_SVG_ICON_PATH.Lock,
    iconType: UiPasswordVisibilityIconType.Svg,
    ariaLabel: 'Show password',
  },
  [UiPasswordVisibilityState.Visible]: {
    type: UiInputType.Text,
    icon: PASSWORD_VISIBILITY_SVG_ICON_PATH.Unlock,
    iconType: UiPasswordVisibilityIconType.Svg,
    ariaLabel: 'Hide password',
  },
};
