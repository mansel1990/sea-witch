import Cards from "./Cards";
import { movies } from "./movies";

interface SliderProps {
  title: string;
  path: string;
  isLarge?: boolean;
}

export default function Slider({ title, path, isLarge }: SliderProps) {
  const items = movies.results;
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {items.map((media) => (
          <Cards
            isLarge={isLarge}
            key={media.id}
            media={media}
            mediaType={media.media_type}
          />
        ))}
      </div>
    </section>
  );
}
