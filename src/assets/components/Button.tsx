// src/components/Button.tsx
import React from 'react';

// Define props for the Button component
interface ButtonProps {
  children: React.ReactNode; // Content inside the button
  onClick?: () => void; // Optional click handler
  variant?: 'primary' | 'secondary' | 'ghost'; // Button style variant
  className?: string; // Additional Tailwind CSS classes
  icon?: React.ReactNode; // Optional icon to display next to text
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'secondary', className = '', icon }) => {
  // Base classes for all buttons
  let baseClasses = 'inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200';

  // Apply variant-specific styles
  switch (variant) {
    case 'primary':
      baseClasses += ' bg-primary text-white shadow-sm hover:bg-indigo-700';
      break;
    case 'secondary':
      baseClasses += ' bg-white text-text-dark border border-border shadow-sm hover:bg-gray-50';
      break;
    case 'ghost':
      baseClasses += ' text-text-light hover:bg-gray-100';
      break;
    default:
      break;
  }

  // Combine base classes with any additional classes passed via props
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <button onClick={onClick} className={combinedClasses}>
      {icon && <span className="mr-2">{icon}</span>} {/* Render icon if provided */}
      {children}
    </button>
  );
};

export default Button;

