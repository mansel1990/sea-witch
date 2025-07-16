const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const ImageSizes = {
  poster: "w500",
  card: "w300",
  backdrop: "w1280",
};

export function generateImageUrl(imagePath: string, size: string) {
  return `${IMAGE_BASE_URL}/${size}${imagePath}`;
}
