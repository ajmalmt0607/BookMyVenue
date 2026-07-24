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
