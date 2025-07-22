interface RfcBadgeProps {
  number: number | string;
  size?: "sm" | "md" | "lg";
  variant?: "pill" | "badge" | "minimal";
}

export default function RfcBadge({
  number,
  size = "md",
  variant = "badge",
}: RfcBadgeProps) {
  // Convert number to string to handle both single numbers and ranges
  const displayNumber = String(number);
  const isLongNumber = displayNumber.length > 4; // Numbers like "9110-9114" or "12345"

  // Size configurations
  const sizeConfig = {
    sm: {
      text: "text-xs",
      padding: "px-2 py-0.5",
    },
    md: {
      text: "text-sm",
      padding: "px-2 py-1",
    },
    lg: {
      text: "text-base",
      padding: "px-3 py-1.5",
    },
  };

  // Variant configurations
  const variantConfig = {
    pill: {
      shape: isLongNumber ? "rounded-lg" : "rounded-full",
      colors: "bg-rfc-blue text-white",
    },
    badge: {
      shape: "rounded-md",
      colors: "bg-rfc-blue text-white",
    },
    minimal: {
      shape: "rounded",
      colors: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    },
  };

  const config = {
    ...sizeConfig[size],
    ...variantConfig[variant],
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center font-medium whitespace-nowrap
        ${config.text}
        ${config.padding}
        ${config.shape}
        ${config.colors}
      `}
      title={`RFC ${displayNumber}`}
    >
      RFC {displayNumber}
    </span>
  );
}
