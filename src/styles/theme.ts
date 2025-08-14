// Theme configuration for Travel Rule Calculator
// Defines consistent colors, spacing, radius, and shadow tokens

export const theme = {
  // Color themes for Sumsub (blue) and Counterparty (purple)
  colors: {
    sumsub: {
      // Primary blue theme for Sumsub VASP
      primary: {
        50: 'bg-blue-50',
        100: 'bg-blue-100',
        200: 'bg-blue-200',
        500: 'bg-blue-500',
        600: 'bg-blue-600',
        700: 'bg-blue-700',
        800: 'bg-blue-800',
        900: 'bg-blue-900',
      },
      text: {
        primary: 'text-blue-900',
        secondary: 'text-blue-700',
        accent: 'text-blue-600',
        muted: 'text-blue-500',
        light: 'text-blue-100',
      },
      border: {
        light: 'border-blue-200',
        medium: 'border-blue-300',
        dark: 'border-blue-400',
      },
      focus: {
        ring: 'focus:ring-blue-500',
        border: 'focus:border-blue-500',
      },
    },
    counterparty: {
      // Primary purple theme for Counterparty VASP
      primary: {
        50: 'bg-purple-50',
        100: 'bg-purple-100',
        200: 'bg-purple-200',
        500: 'bg-purple-500',
        600: 'bg-purple-600',
        700: 'bg-purple-700',
        800: 'bg-purple-800',
        900: 'bg-purple-900',
      },
      text: {
        primary: 'text-purple-900',
        secondary: 'text-purple-700',
        accent: 'text-purple-600',
        muted: 'text-purple-500',
        light: 'text-purple-100',
      },
      border: {
        light: 'border-purple-200',
        medium: 'border-purple-300',
        dark: 'border-purple-400',
      },
      focus: {
        ring: 'focus:ring-purple-500',
        border: 'focus:border-purple-500',
      },
    },
    // Common semantic colors
    semantic: {
      success: {
        50: 'bg-green-50',
        100: 'bg-green-100',
        500: 'bg-green-500',
        600: 'bg-green-600',
        700: 'bg-green-700',
        800: 'bg-green-800',
        text: 'text-green-800',
        border: 'border-green-200',
      },
      warning: {
        50: 'bg-yellow-50',
        100: 'bg-yellow-100',
        500: 'bg-yellow-500',
        600: 'bg-yellow-600',
        700: 'bg-yellow-700',
        800: 'bg-yellow-800',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
      },
      error: {
        50: 'bg-red-50',
        100: 'bg-red-100',
        500: 'bg-red-500',
        600: 'bg-red-600',
        700: 'bg-red-700',
        800: 'bg-red-800',
        text: 'text-red-800',
        border: 'border-red-200',
      },
      neutral: {
        50: 'bg-gray-50',
        100: 'bg-gray-100',
        200: 'bg-gray-200',
        300: 'bg-gray-300',
        400: 'bg-gray-400',
        500: 'bg-gray-500',
        600: 'bg-gray-600',
        700: 'bg-gray-700',
        800: 'bg-gray-800',
        900: 'bg-gray-900',
        text: 'text-gray-700',
        border: 'border-gray-200',
      },
    },
  },

  // Consistent spacing tokens
  spacing: {
    xs: 'p-1 px-1 py-1 m-1 mx-1 my-1',
    sm: 'p-2 px-2 py-2 m-2 mx-2 my-2',
    md: 'p-3 px-3 py-3 m-3 mx-3 my-3',
    lg: 'p-4 px-4 py-4 m-4 mx-4 my-4',
    xl: 'p-6 px-6 py-6 m-6 mx-6 my-6',
    '2xl': 'p-8 px-8 py-8 m-8 mx-8 my-8',
    // Specific spacing combinations
    input: 'px-3 py-2',
    button: 'px-4 py-2',
    buttonLarge: 'px-8 py-3',
    card: 'p-4 sm:p-6',
    header: 'px-4 py-3',
    section: 'p-4',
    container: 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12',
  },

  // Consistent border radius tokens
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    // Specific radius for different components
    input: 'rounded-md',
    button: 'rounded-md',
    card: 'rounded-lg',
    pill: 'rounded-lg',
    badge: 'rounded-full',
  },

  // Consistent shadow tokens
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    // Specific shadows for different states
    input: 'shadow-sm',
    button: 'shadow-sm',
    buttonHover: 'shadow-md',
    card: 'shadow-sm',
    dropdown: 'shadow-lg',
    tooltip: 'shadow-lg',
  },

  // Transition tokens
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    // Specific transitions
    colors: 'transition-colors duration-150',
    transform: 'transition-transform duration-150 ease-out',
    opacity: 'transition-opacity duration-150',
  },

  // Focus states
  focus: {
    ring: {
      sm: 'focus:ring-2',
      md: 'focus:ring-4',
      lg: 'focus:ring-8',
    },
    outline: 'focus:outline-none',
    visible: 'focus-visible:ring-2 focus-visible:ring-blue-500',
  },

  // Layout tokens
  layout: {
    container: 'max-w-7xl mx-auto',
    grid: {
      cols1: 'grid-cols-1',
      cols2: 'grid-cols-2',
      cols3: 'grid-cols-3',
      gap: {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
    },
    spacing: {
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8',
    },
  },
};

// Helper function to get theme colors for a specific VASP type
export const getVaspTheme = (type: 'sumsub' | 'counterparty') => {
  return {
    bg: theme.colors[type].primary[50],
    border: theme.colors[type].border.light,
    header: theme.colors[type].primary[600],
    text: theme.colors[type].text.primary,
    accent: theme.colors[type].text.secondary,
    focus: theme.colors[type].focus,
  };
};

// Helper function to get common component styles
export const getComponentStyles = {
  input: `${theme.spacing.input} ${theme.radius.input} ${theme.shadow.input} ${theme.focus.outline} ${theme.focus.ring.sm} ${theme.transition.colors}`,
  button: `${theme.spacing.button} ${theme.radius.button} ${theme.shadow.button} ${theme.transition.colors}`,
  buttonLarge: `${theme.spacing.buttonLarge} ${theme.radius.button} ${theme.shadow.button} ${theme.transition.normal}`,
  card: `${theme.spacing.card} ${theme.radius.card} ${theme.shadow.card}`,
  header: `${theme.spacing.header}`,
  section: `${theme.spacing.section}`,
  container: `${theme.layout.container} ${theme.spacing.container}`,
};

export default theme;
