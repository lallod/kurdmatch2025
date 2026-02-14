import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '475px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			fontFamily: {
				sans: ['Inter var', 'sans-serif'],
				'kurdish-sorani': ['Noto Sans Arabic', 'Arial', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: 'hsl(var(--surface))',
				'surface-secondary': 'hsl(var(--surface-secondary))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
					light: 'hsl(var(--primary-light))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				tinder: {
					rose: "#F43F8E",
					orange: "#FB6FA9",
					peach: "#F43F8E",
					light: "#FB6FA9",
					dark: "#140F1F"
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'swipe-right': {
					'0%': { transform: 'translateX(0) rotate(0)' },
					'100%': { transform: 'translateX(150%) rotate(30deg)' }
				},
				'swipe-left': {
					'0%': { transform: 'translateX(0) rotate(0)' },
					'100%': { transform: 'translateX(-150%) rotate(-30deg)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'80%': { transform: 'scale(1.1)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-heart': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.25)' }
				},
				'midnight-pulse': {
					'0%, 100%': { opacity: '0.3' },
					'50%': { opacity: '0.6' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-up': 'fade-up 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'swipe-right': 'swipe-right 0.5s ease-out forwards',
				'swipe-left': 'swipe-left 0.5s ease-out forwards',
				'bounce-in': 'bounce-in 0.5s ease-out',
				'pulse-heart': 'pulse-heart 1.5s infinite',
				'midnight-pulse': 'midnight-pulse 4s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-tinder': 'linear-gradient(to right, #F43F8E, #FB6FA9)',
				'gradient-brand': 'linear-gradient(135deg, #2A1E45, #F43F8E)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
