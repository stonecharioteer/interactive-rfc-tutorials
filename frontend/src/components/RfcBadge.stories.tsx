// Story file to demonstrate RFC Badge variants (for development reference)
// This shows how the badge handles different RFC number formats

export const RfcBadgeExamples = {
  // Current implementations
  short: "793",
  medium: "821",

  // Future implementations that will benefit from the new design
  long: "9110-9114",
  veryLong: "12345",
  range: "4301-4303",

  // Different sizes and variants demonstrated:
  variants: [
    { number: "793", size: "sm", variant: "minimal" }, // Home page style
    { number: "821", size: "md", variant: "badge" }, // Detail page style
    { number: "9110-9114", size: "md", variant: "badge" }, // Future RFC ranges
    { number: "12345", size: "lg", variant: "pill" }, // Very long numbers
  ],
};

// The RfcBadge component automatically:
// - Uses rounded-md for all badges (better for longer numbers than rounded-full)
// - Adapts padding and font size based on content length
// - Uses whitespace-nowrap to prevent breaking
// - Provides different variants for different use cases
//
// This solves the original "blue pill" problem where rounded-full looked awkward
// with longer RFC numbers like "9110-9114" or multi-RFC documents.
