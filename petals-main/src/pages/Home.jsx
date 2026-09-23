import React, { useState } from "react";
import SplashScreen from "../splashscreen/splashscrren.jsx";
import CardSlider from "../componets/Product/Cardslider.jsx";
import Bestseller from "../componets/Product/slidercard/Bestseller.jsx";
import Zcommunity from "../componets/Product/slidercard/Z-communtity.jsx";
import HairOils from "../componets/Product/slidercard/HairOils.jsx";
import "../App.css";
import Footer from "../componets/footer/footdetails.jsx";
import Testamonial from "./Testimonial/Testamonial.jsx";

import BannerPage from "../componets/Product/slidercard/BannerPage.jsx";
import About from "./About.jsx";
import Whyas from "./Whyas.jsx";
import ReviewGallery from "./gallery/reviewgallery.jsx";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      
      <BannerPage />
      <HairOils />
      <Bestseller />
      <Whyas />
      <Zcommunity />
      <About />
      {/* <CardSlider /> */}
      <Testamonial />
      <ReviewGallery/>
      <br />

      
    </>
  );
};

export default Home;