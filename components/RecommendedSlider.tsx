"use client";
import Slider from "@/components/Slider";
import { useGlobalStore } from "@/lib/store";

export default function RecommendedSlider() {
  const clerkUserId = useGlobalStore((state) => state.clerkUserId);
  if (!clerkUserId) return null;
  return (
    <Slider
      title="Handpicked For You"
      url={`/recommendations/${clerkUserId}`}
    />
  );
}
