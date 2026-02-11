"use client";
import Slider from "@/components/Slider";
import { useGlobalStore } from "@/lib/store";

export default function RecommendedSlider() {
  const userId = useGlobalStore((state) => state.userId);
  if (!userId) return null;
  return (
    <Slider
      title="Handpicked For You"
      url={`/recommendations/${userId}`}
    />
  );
}
