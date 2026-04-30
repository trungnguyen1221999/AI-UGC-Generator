import React from "react";

const Loader2Icon: React.FC<{ className?: string }> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`animate-spin text-indigo-500 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

export default Loader2Icon;
