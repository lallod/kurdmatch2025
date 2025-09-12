// Swipe Page Configuration - Easy to modify for quick changes
export const SWIPE_CONFIG = {
  // Card Dimensions (responsive)
  card: {
    maxWidth: {
      mobile: 'w-[95vw]', // Increased from 90vw to fit device better
      tablet: 'w-[450px]', // Increased from 400px
      desktop: 'w-[480px]' // Increased from 420px
    },
    height: {
      mobile: 'h-[80vh]', // Increased from 75vh to fit device better
      tablet: 'h-[650px]', // Increased from 600px
      desktop: 'h-[700px]' // Increased from 650px
    },
    minHeight: 'min-h-[550px]', // Increased from 500px
    maxHeight: 'max-h-[750px]', // Increased from 700px
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
      padding: 'px-1 sm:px-2', // Reduced padding for more space
      minHeight: 'h-full', // Fill 100% height
      spacing: 'py-2 sm:py-4' // Reduced spacing for more card space
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