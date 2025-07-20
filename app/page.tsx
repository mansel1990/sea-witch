import Banner from "@/components/Banner";
import Slider from "@/components/Slider";
import RecommendedSlider from "@/components/RecommendedSlider";

export default function HomeScreen() {
  return (
    <div className="min-h-screen bg-black">
      <Banner />
      <div className="px-4 md:px-8 lg:px-16 space-y-8 pb-8">
        <Slider title="Latest Movie Reviews" url="/movies/popular/recent" />
        <RecommendedSlider />
        <Slider title="Trending Now" url="/movies/upcoming" />
      </div>
    </div>
  );
}
