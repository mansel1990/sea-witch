import React from "react";

export default function PageSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`w-full h-64 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded-lg shadow-inner ${className}`}
      aria-label="Loading content"
      role="status"
    >
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-3/4 h-8 bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="w-1/2 h-6 bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="w-2/3 h-6 bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="w-1/3 h-6 bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}
