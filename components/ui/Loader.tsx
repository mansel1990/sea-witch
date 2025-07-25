import React from "react";

export default function Loader({
  className = "",
  overlay = true,
}: {
  className?: string;
  overlay?: boolean;
}) {
  if (overlay) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm ${className}`}
        role="status"
        aria-live="polite"
      >
        <svg
          className="animate-spin h-10 w-10 text-red-600 mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-white text-lg font-medium ml-4">Loading...</span>
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg
        className="animate-spin h-10 w-10 text-red-600 mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-white text-lg font-medium">Loading...</span>
    </div>
  );
}
