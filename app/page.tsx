import Banner from "@/components/Banner";
import Slider from "@/components/Slider";

export default function HomeScreen() {
  return (
    <div className="min-h-screen bg-black">
      <Banner />
      <div className="px-4 md:px-8 lg:px-16 space-y-8 pb-8">
        <Slider
          title="Latest Movie Reviews"
          path="/trending/all/week"
          isLarge
        />
        <Slider
          title="Movies Reviewed by Friends"
          path="/trending/all/week"
          isLarge
        />
        <Slider title="Trending Now" path="/trending/all/week" isLarge />
        <Slider title="Popular This Week" path="/trending/all/week" isLarge />
      </div>
    </div>
  );
}
