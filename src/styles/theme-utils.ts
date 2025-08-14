// Theme utility functions and constants for Travel Rule Calculator
// Provides easy access to theme tokens and common style combinations

import { theme, getVaspTheme, getComponentStyles } from './theme';

// Export the main theme object
export { theme, getVaspTheme, getComponentStyles };

// Common style combinations for frequently used patterns
export const commonStyles = {
  // Button variants
  buttons: {
    primary: `${getComponentStyles.button} bg-sumsub-600 hover:bg-sumsub-700 text-white`,
    secondary: `${getComponentStyles.button} bg-counterparty-600 hover:bg-counterparty-700 text-white`,
    outline: `${getComponentStyles.button} border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50`,
    ghost: `${getComponentStyles.button} bg-transparent text-neutral-700 hover:bg-neutral-100`,
    disabled: `${getComponentStyles.button} bg-neutral-100 text-neutral-400 cursor-not-allowed`,
  },

  // Input variants
  inputs: {
    default: `${getComponentStyles.input} border-neutral-300 focus:border-sumsub-500 focus:ring-sumsub-200`,
    error: `${getComponentStyles.input} border-error-300 focus:border-error-500 focus:ring-error-200`,
    success: `${getComponentStyles.input} border-success-300 focus:border-success-500 focus:ring-success-200`,
  },

  // Card variants
  cards: {
    default: `${getComponentStyles.card}`,
    elevated: `${getComponentStyles.card} shadow-medium`,
    interactive: `${getComponentStyles.card} hover:shadow-medium transition-shadow duration-200 cursor-pointer`,
  },

  // Status indicators
  status: {
    success: `${theme.colors.semantic.success[100]} ${theme.colors.semantic.success.text} ${theme.colors.semantic.success.border}`,
    warning: `${theme.colors.semantic.warning[100]} ${theme.colors.semantic.warning.text} ${theme.colors.semantic.warning.border}`,
    error: `${theme.colors.semantic.error[100]} ${theme.colors.semantic.error.text} ${theme.colors.semantic.error.border}`,
    info: `${theme.colors.sumsub.primary[100]} ${theme.colors.sumsub.text.secondary} ${theme.colors.sumsub.border.light}`,
  },
};

// VASP-specific theme helpers
export const vaspThemes = {
  sumsub: {
    ...getVaspTheme('sumsub'),
    // Additional Sumsub-specific styles
    button: `${getComponentStyles.button} bg-sumsub-600 hover:bg-sumsub-700 text-white`,
    badge: `${theme.colors.sumsub.primary[100]} ${theme.colors.sumsub.text.secondary} ${theme.colors.sumsub.border.light}`,
    focus: 'focus:ring-2 focus:ring-sumsub-200 focus:border-sumsub-500',
  },
  counterparty: {
    ...getVaspTheme('counterparty'),
    // Additional Counterparty-specific styles
    button: `${getComponentStyles.button} bg-counterparty-600 hover:bg-counterparty-700 text-white`,
    badge: `${theme.colors.counterparty.primary[100]} ${theme.colors.counterparty.text.secondary} ${theme.colors.counterparty.border.light}`,
    focus:
      'focus:ring-2 focus:ring-counterparty-200 focus:border-counterparty-500',
  },
};

// Layout helpers
export const layout = {
  container: theme.layout.container,
  grid: {
    cols1: theme.layout.grid.cols1,
    cols2: theme.layout.grid.cols2,
    cols3: theme.layout.grid.cols3,
    gap: theme.layout.grid.gap,
  },
  spacing: theme.layout.spacing,
};

// Animation helpers
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
};

// Focus state helpers
export const focusStates = {
  default: theme.focus.outline,
  ring: {
    sm: theme.focus.ring.sm,
    md: theme.focus.ring.md,
    lg: theme.focus.ring.lg,
  },
  visible: theme.focus.visible,
};

// Transition helpers
export const transitions = {
  fast: theme.transition.fast,
  normal: theme.transition.normal,
  slow: theme.transition.slow,
  colors: theme.transition.colors,
  transform: theme.transition.transform,
  opacity: theme.transition.opacity,
};

// Utility function to combine multiple style classes
export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

// Utility function to conditionally apply styles
export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass: string = ''
): string => {
  return condition ? trueClass : falseClass;
};

// Utility function to get responsive classes
export const responsiveClass = (
  base: string,
  sm?: string,
  lg?: string
): string => {
  return combineClasses(base, sm && `sm:${sm}`, lg && `lg:${lg}`);
};

// Export all theme-related utilities
export default {
  theme,
  getVaspTheme,
  getComponentStyles,
  commonStyles,
  vaspThemes,
  layout,
  animations,
  focusStates,
  transitions,
  combineClasses,
  conditionalClass,
  responsiveClass,
};
