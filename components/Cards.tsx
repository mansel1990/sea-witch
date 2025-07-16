import { generateImageUrl, ImageSizes } from "./tmdb";

type Media = {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
};

type CardsProps = {
  media: Media;
  mediaType?: string;
  isLarge?: boolean;
};

export default function Cards({ media, isLarge }: CardsProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow bg-card w-40 sm:w-48 m-2 flex-shrink-0">
      <img
        className={`w-full object-cover ${isLarge ? "h-60" : "h-32"}`}
        src={
          isLarge
            ? generateImageUrl(media.poster_path || "", ImageSizes.poster)
            : generateImageUrl(media.backdrop_path || "", ImageSizes.card)
        }
        alt={media.original_title || media.title || media.name || ""}
      />
      <div className="p-2">
        <div className="font-semibold text-base truncate">
          {media.title || media.name || media.original_name}
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {media.overview}
        </div>
      </div>
    </div>
  );
}
