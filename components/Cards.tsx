/* eslint-disable @next/next/no-img-element */
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
    <div className="group relative rounded-md overflow-hidden shadow-lg bg-gray-900 w-40 sm:w-48 flex-shrink-0 hover-scale transition-all duration-300">
      <img
        className={`w-full object-cover ${
          isLarge ? "h-60" : "h-32"
        } group-hover:scale-110 transition-transform duration-300`}
        src={
          isLarge
            ? generateImageUrl(media.poster_path || "", ImageSizes.poster)
            : generateImageUrl(media.backdrop_path || "", ImageSizes.card)
        }
        alt={media.original_title || media.title || media.name || ""}
      />

      {/* Netflix-style gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="font-semibold text-sm text-white truncate mb-1">
          {media.title || media.name || media.original_name}
        </div>
        <div className="text-xs text-gray-300 line-clamp-2">
          {media.overview}
        </div>
      </div>

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
