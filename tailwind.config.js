/** @type {import('tailwindcss').Config} */
export default {
  // Configure files to scan for Tailwind classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors inspired by the Figma design (PDF screenshot)
      colors: {
        primary: '#4F46E5', // A shade of indigo/violet for primary actions
        secondary: '#6B7280', // Gray for secondary text/borders
        background: '#F9FAFB', // Light gray background
        card: '#FFFFFF', // White for card-like elements
        border: '#E5E7EB', // Lighter gray for borders
        accent: '#10B981', // Green for success/active states
        'text-dark': '#1F2937', // Dark gray for main text
        'text-light': '#6B7280', // Lighter gray for secondary text
      },
      // Custom font family (Inter is a common choice and visually similar)
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Custom box shadow for cards/elements
      boxShadow: {
        'custom-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'custom-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

