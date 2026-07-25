export const toTitleCase = (
  value
) => {

  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

};

export const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString()}`;

const RELATIVE_TIME_UNITS = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
];

// "Last updated 8 minutes ago" - stays a relative label for the first
// week, then falls back to a plain date so it doesn't grow inaccurate-
// looking ("47 days ago") for anything left untouched a long while.
export const formatRelativeTime = (isoString) => {
  const then = new Date(isoString);
  const seconds = Math.max(0, (Date.now() - then.getTime()) / 1000);

  if (seconds < 5) return "just now";

  for (const { limit, divisor, unit } of RELATIVE_TIME_UNITS) {
    if (seconds < limit) {
      const value = Math.floor(seconds / divisor);
      return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
    }
  }

  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
