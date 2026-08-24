import React from "react";

import HomeVehicle from "../../Components/HomeVehicle/HomeVehicle";
import HomeMostVechicle from "../../Components/HomeMostVechicle/HomeMostVechicle";
import HeroBestCarRentalSystem from "../../Components/HeroBestCarRentalSystem/HeroBestCarRentalSystem";
import HomeBrowseByType from "../../Components/HomeBrowseByType/HomeBrowseByType";
import HomeCalculate from "../../Components/HomeCalculate/HomeCalculate";
import HomeFeatureList from "../../Components/HomeFeatureList/HomeFeatureList";
import HomeTrusted from "../../Components/HomeTrusted/HomeTrusted";
import HomePriceChart from "../../Components/HomePriceChart/HomePriceChart";
import Testimonial from "../../Components/Testimonial/Testimonial";

const Home = () => {
  return (
    <main className="home-page">

      {/* =================================================
          HOME
      ================================================= */}

      <section
        id="home"
        className="home-section home-section--home"
      >
        <HomeVehicle />
      </section>


      {/* =================================================
          POPULAR VEHICLES
      ================================================= */}

      <section
        id="about"
        className="home-section home-section--vehicles"
      >
        <HomeMostVechicle />
      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section
        id="services"
        className="home-section home-section--services"
      >
        <HeroBestCarRentalSystem />
      </section>


      {/* =================================================
          VEHICLE TYPE
      ================================================= */}

      <section
        id="type"
        className="home-section home-section--type"
      >
        <HomeBrowseByType />
      </section>


      {/* =================================================
          CALCULATOR
      ================================================= */}

      <section
        id="calculator"
        className="home-section home-section--calculator"
      >
        <HomeCalculate />
      </section>


      {/* =================================================
          PRICING
      ================================================= */}

      <section
        id="pricing"
        className="home-section home-section--pricing"
      >
        <HomePriceChart />
      </section>


      {/* =================================================
          FEATURES
      ================================================= */}

      <section
        id="features"
        className="home-section home-section--features"
      >
        <HomeFeatureList />
      </section>


      {/* =================================================
          TRUSTED
      ================================================= */}

      <section
        id="trusted"
        className="home-section home-section--trusted"
      >
        <HomeTrusted />
      </section>


      {/* =================================================
          TESTIMONIALS
      ================================================= */}

      <section
        id="testimonials"
        className="home-section home-section--testimonials"
      >
        <Testimonial />
      </section>

    </main>
  );
};

export default Home;