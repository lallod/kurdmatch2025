// Swipe Page Configuration - Easy to modify for quick changes
export const SWIPE_CONFIG = {
  // Card Dimensions (responsive)
  card: {
    maxWidth: {
      mobile: 'w-[96vw]',
      tablet: 'w-[85vw] max-w-[450px]',
      desktop: 'w-[80vw] max-w-[480px]'
    },
    height: {
      mobile: 'h-[calc(100vh-200px)]',
      tablet: 'h-[calc(100vh-240px)]',
      desktop: 'h-[calc(100vh-260px)]'
    },
    minHeight: 'min-h-[500px]',
    maxHeight: 'max-h-[calc(100vh-120px)]',
    borderRadius: 'rounded-3xl'
  },

  // Header Configuration
  header: {
    height: 'py-1.5 sm:py-2.5', // Reduced by 60%
    padding: 'px-4 sm:px-6',
    maxWidth: 'max-w-4xl',
    icon: {
      size: 'w-8 h-8 sm:w-10 sm:h-10', // Reduced by 60%
      margin: 'mb-1 sm:mb-1.5' // Reduced by 60%
    },
    title: {
      size: 'text-lg sm:text-xl', // Reduced by 60%
      spacing: 'space-y-0.5 sm:space-y-1' // Reduced by 60%
    }
  },

  // Card Stack Configuration
  stack: {
    container: {
      padding: 'px-2 sm:px-3',
      minHeight: 'min-h-0',
      spacing: 'py-0'
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
      bottom: 'bottom-14 sm:bottom-16',
      padding: 'px-3 sm:px-6'
    },
    buttons: {
      small: 'w-14 h-14 sm:w-14 sm:h-14',
      large: 'w-16 h-16 sm:w-16 sm:h-16',
      gap: 'gap-2 sm:gap-3',
      iconSize: {
        small: 'w-6 h-6 sm:w-6 sm:h-6',
        large: 'w-7 h-7 sm:w-8 sm:h-8'
      }
    }
  },

  // Photo Gallery Configuration
  gallery: {
    indicators: {
      top: 'top-3 sm:top-4',
      size: 'h-1 sm:h-1',
      active: 'w-8 sm:w-8',
      inactive: 'w-1.5 sm:w-1.5',
      gap: 'gap-1 sm:gap-1.5',
      padding: 'px-3 sm:px-3 py-2 sm:py-2'
    }
  },

  // Profile Info Configuration
  info: {
    overlay: {
      height: 'h-36 sm:h-40',
      padding: 'bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4'
    },
    name: {
      size: 'text-xl sm:text-2xl'
    },
    age: {
      size: 'text-lg sm:text-xl'
    },
    location: {
      gap: 'gap-1.5 sm:gap-2',
      iconSize: 'w-3.5 h-3.5 sm:w-4 sm:h-4'
    },
    interests: {
      gap: 'gap-1 sm:gap-1.5',
      padding: 'px-2 sm:px-2.5 py-0.5 sm:py-1',
      textSize: 'text-xs'
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