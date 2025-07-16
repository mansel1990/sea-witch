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
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex overflow-x-auto pb-2 -mx-2">
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
