import classNames from "classnames";

export const cx = classNames;

// Format status string to capitalize each word
export const formatStatusStr = (str) => {
  if (!str) return "";

  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function formatFromMB(mbValue) {
  if (mbValue == null || isNaN(mbValue)) return "";

  let value = Number(mbValue);

  // Convert units
  let unit = "MB";
  if (value >= 1024) {
    value = value / 1024;
    unit = "GB";
  }
  if (value >= 1024) {
    value = value / 1024;
    unit = "TB";
  }

  // Format to 2 decimals
  let formatted = value.toFixed(2);

  // Remove trailing .00
  formatted = formatted.replace(/\.00$/, "");

  // Remove trailing 0 in cases like 1.50 → 1.5
  formatted = formatted.replace(/\.0$/, "");

  return `${formatted} ${unit}`;
}
