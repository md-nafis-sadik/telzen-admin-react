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

export const getStatusUI = (status) => {
  switch (status) {
    case "registered":
      return <span className="text-[#9E9E9E] font-normal">Registered</span>;

    case "onboard":
      return <span className="text-[#75c780] font-normal">Onboard</span>;

    case "activated":
      return <span className="text-[#00AE5B] font-normal">Activated</span>;

    case "expired":
      return <span className="text-red-500 font-normal">Expired</span>;

    case "deleted":
      return <span className="text-red-500 font-normal">Deleted</span>;

    default:
      return <span className="text-[#9E9E9E] font-normal">Registered</span>;
  }
};
