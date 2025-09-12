// Swipe Page Configuration - Easy to modify for quick changes
export const SWIPE_CONFIG = {
  // Card Dimensions (responsive)
  card: {
    maxWidth: {
      mobile: 'w-[90vw]',
      tablet: 'w-[400px]',
      desktop: 'w-[420px]'
    },
    height: {
      mobile: 'h-[75vh]',
      tablet: 'h-[600px]',
      desktop: 'h-[650px]'
    },
    minHeight: 'min-h-[500px]',
    maxHeight: 'max-h-[700px]',
    borderRadius: 'rounded-3xl'
  },

  // Header Configuration
  header: {
    height: 'py-4 sm:py-6',
    padding: 'px-4 sm:px-6',
    maxWidth: 'max-w-4xl',
    icon: {
      size: 'w-12 h-12 sm:w-16 sm:h-16',
      margin: 'mb-2 sm:mb-4'
    },
    title: {
      size: 'text-2xl sm:text-3xl',
      spacing: 'space-y-1 sm:space-y-2'
    }
  },

  // Card Stack Configuration
  stack: {
    container: {
      padding: 'px-2 sm:px-4',
      minHeight: 'min-h-[calc(100vh-240px)]',
      spacing: 'py-4 sm:py-8'
    },
    background: {
      scale: [0.95, 0.90], // Scale factors for background cards
      opacity: [0.7, 0.5], // Opacity for background cards
      offset: [8, 16] // Y offset in pixels
    }
  },

  // Actions Configuration
  actions: {
    container: {
      bottom: 'bottom-16 sm:bottom-20',
      padding: 'px-4 sm:px-8'
    },
    buttons: {
      small: 'w-12 h-12 sm:w-14 sm:h-14',
      large: 'w-14 h-14 sm:w-16 sm:h-16',
      gap: 'gap-3 sm:gap-4',
      iconSize: {
        small: 'w-5 h-5 sm:w-6 sm:h-6',
        large: 'w-6 h-6 sm:w-8 sm:h-8'
      }
    }
  },

  // Photo Gallery Configuration
  gallery: {
    indicators: {
      top: 'top-4 sm:top-6',
      size: 'h-0.5 sm:h-1',
      active: 'w-6 sm:w-8',
      inactive: 'w-1 sm:w-1.5',
      gap: 'gap-1 sm:gap-1.5',
      padding: 'px-2 sm:px-3 py-1.5 sm:py-2'
    }
  },

  // Profile Info Configuration
  info: {
    overlay: {
      height: 'h-32 sm:h-40',
      padding: 'bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6'
    },
    name: {
      size: 'text-2xl sm:text-3xl'
    },
    age: {
      size: 'text-xl sm:text-2xl'
    },
    location: {
      gap: 'gap-2 sm:gap-3',
      iconSize: 'w-4 h-4'
    },
    interests: {
      gap: 'gap-1.5 sm:gap-2',
      padding: 'px-2.5 sm:px-3 py-1',
      textSize: 'text-xs sm:text-sm'
    }
  },

  // Swipe Overlay Configuration
  overlay: {
    textSize: 'text-4xl sm:text-5xl lg:text-6xl',
    padding: 'px-6 sm:px-8 py-3 sm:py-4',
    borderRadius: 'rounded-xl sm:rounded-2xl',
    borderWidth: 'border-2 sm:border-4'
  },

  // Animation Configuration
  animations: {
    dragRotation: 0.1, // Rotation multiplier during drag
    minOpacity: 0.7, // Minimum opacity during drag
    opacityMultiplier: 0.001, // Opacity change rate
    threshold: 100 // Swipe threshold in pixels
  }
} as const;

// Utility function to get responsive classes
export const getResponsiveClass = (config: string) => {
  return config;
};

// Mobile-first breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
} as const;