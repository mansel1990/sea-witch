import React, { useState, useEffect } from "react";

import { generateImageUrl, ImageSizes } from "../utils/tmdb";
import { movies } from "../utils/movies";
import TextRating from "./TextRating";

const Banner = () => {
  const [movie, setMovie] = useState({});

  useEffect(() => {
    setMovie(
      movies.results[Math.floor(Math.random() * movies.results.length - 1)]
    );
  }, []);

  return (
    <div
      className="banner"
      style={{
        backgroundImage: `url(${generateImageUrl(
          movie?.backdrop_path || "",
          ImageSizes.backdrop
        )})`,
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <h1 className="banner__description">{movie?.overview}</h1>

        <TextRating rating={3.5} />
        <div className="banner__buttons my-3">
          <button className="banner__button">Reviews</button>
          <button className="banner__button">Add to Watchlist</button>
        </div>
      </div>
      <div className="banner__cover" />
    </div>
  );
};

export default Banner;
