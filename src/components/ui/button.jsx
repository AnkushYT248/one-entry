import Link from "next/link";
import clsx from "clsx";

const Button = ({
  variant = "default", // Button variant
  size = "base", // Button size
  href = null, // Link destination for navigation
  disabled = false, // Disabled state for the button
  icon, // Icon JSX before the text, optional
  iconPosition = "left", // Position of the icon ['left', 'right']
  children, // Button inner content
  className, // Additional custom classes
  ...props // Other props for customization
}) => {
  // Predefined styles for variants
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    primary: "bg-emerald-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    info: "bg-blue-600 text-white hover:bg-blue-500",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
  };

  // Predefined styles for different sizes
  const sizes = {
    base: "px-4 py-2 text-lg",
    large: "px-6 py-3 text-xl",
    small: "px-3 py-1 text-xs",
  };

  // Check for invalid variants or sizes
  const appliedVariant = variants[variant] || variants.default;
  const appliedSize = sizes[size] || sizes.base;

  // Component classes
  const buttonClass = clsx(
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    appliedVariant,
    appliedSize,
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  // Icon rendering logic
  const renderIcon = icon && (
    <span
      className={clsx(
        "inline-flex",
        iconPosition === "left" ? "mr-2" : "ml-2"
      )}
    >
      {icon}
    </span>
  );

  // Return a link if `href` is passed; otherwise, render as a button
  if (href) {
    return (
      <Link href={href} passHref>
        <span
          className={buttonClass}
          aria-disabled={disabled}
          {...props}
        >
          {iconPosition === "left" && renderIcon}
          {children}
          {iconPosition === "right" && renderIcon}
        </span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={buttonClass}
      aria-disabled={disabled}
      disabled={disabled}
      {...props}
    >
      {iconPosition === "left" && renderIcon}
      {children}
      {iconPosition === "right" && renderIcon}
    </button>
  );
};

export default Button;