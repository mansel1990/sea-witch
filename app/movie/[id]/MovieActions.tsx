import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Eye, EyeOff } from "lucide-react";

export default function MovieActions({
  viewed,
  toggleViewed,
  children,
}: {
  viewed: boolean;
  toggleViewed: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 text-sm sm:text-base">
        <BookmarkPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Add to Watchlist
      </Button>
      <span
        className={`inline-flex items-center font-semibold px-4 py-2 text-sm sm:text-base rounded-lg ${
          viewed ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
        }`}
        onClick={toggleViewed}
        style={{ cursor: "pointer" }}
        title={viewed ? "Mark as not watched" : "Mark as watched"}
      >
        {viewed ? (
          <>
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Watched
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Yet to watch
          </>
        )}
      </span>
      {children}
    </div>
  );
}
