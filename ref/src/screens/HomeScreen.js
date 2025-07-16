import React from "react";
import Slider from "../components/Slider";
import Banner from "../components/Banner";

const HomeScreen = () => {
  return (
    <div>
      <Banner />
      <Slider title="Latest Movies Reviews" path="/trending/all/week" isLarge />
      <Slider
        title="Movies Reviewed by Friends"
        path="/trending/all/week"
        isLarge
      />
    </div>
  );
};

export default HomeScreen;
