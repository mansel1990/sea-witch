"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getUserSummary, type UserSummary } from "@/lib/api/getUserSummary";
import { useToast } from "@/components/ui/toast";
import { Film } from "lucide-react";

export default function UserSummary() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { showToast } = useToast();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserSummary() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getUserSummary(user.id);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch user summary:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSummary();
  }, [user?.id, showToast]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const displayName = user.name?.split(" ")[0] || "Movie Lover";
  const initial = user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {initial}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Welcome back, {displayName}!
          </h2>
          <p className="text-gray-400 text-sm">
            Here&apos;s your movie journey summary
          </p>
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-400/10">
            <Film className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Your Movie Profile
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed text-base">
          {summary.summary}
        </p>
      </div>
    </div>
  );
}
