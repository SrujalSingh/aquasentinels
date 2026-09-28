import React from 'react';

export function StatusBadge({ status, size = "md" }) {
  let styleClasses = "bg-gray-100 text-gray-700 border-gray-200";

  switch (status) {
    case "Detected":
      styleClasses = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "Under Analysis":
      styleClasses = "bg-blue-50 text-blue-800 border-blue-200";
      break;
    case "Drift Calculated":
      styleClasses = "bg-teal-50 text-teal-800 border-teal-200";
      break;
    case "AIS Correlation":
      styleClasses = "bg-sky-50 text-sky-800 border-sky-300 font-medium";
      break;
    case "Under Review":
      styleClasses = "bg-purple-50 text-purple-800 border-purple-200";
      break;
    case "Closed":
      styleClasses = "bg-slate-100 text-slate-600 border-slate-200";
      break;
    case "High":
      styleClasses = "bg-red-50 text-red-700 border-red-200 font-medium";
      break;
    case "Medium":
      styleClasses = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "Low":
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "Operational":
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium";
      break;
    default:
      styleClasses = "bg-gray-50 text-gray-700 border-gray-200";
  }

  const pxClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-md border font-normal ${pxClass} ${styleClasses}`}>
      {status}
    </span>
  );
}
