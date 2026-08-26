import React from "react";
import { Helmet } from "react-helmet";

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
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRental",
        "@id": "https://youngdrives.in/#autorental",
        "name": "Young Drives",
        "url": "https://youngdrives.in",
        "telephone": "+91 90784 55208",
        "priceRange": "₹₹",
        "image": "https://youngdrives.in/assets/banner.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No :-001, CRP square, Vanik road, Back side of Ama Bus Stand",
          "addressLocality": "Bhubaneswar",
          "addressRegion": "Odisha",
          "postalCode": "75011",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "20.2961",
          "longitude": "85.8245"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        },
        "sameAs": [
          "https://www.facebook.com/youngdrives",
          "https://www.instagram.com/youngdrives"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://youngdrives.in/#website",
        "url": "https://youngdrives.in",
        "name": "Young Drives - Car Rental Bhubaneswar",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://youngdrives.in/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <main className="home-page">
      <Helmet>
        {/* Core Metadata */}
        <title>Best Car Rental in Bhubaneswar | Self Drive & Chauffeur Cars - Young Drives</title>
        <meta
          name="description"
          content="Young Drives offers the best car rental in Bhubaneswar. Book self drive cars, airport pickup, chauffeur-driven luxury cars, & EV rentals at low prices."
        />
        <meta
          name="keywords"
          content="best car rental in bhubaneswar, best car rental in bhubaneswar airport, best car rental in bhubaneswar with driver, best self drive car rental in bhubaneswar, self driven car rental in bhubaneswar, cheapest car rental in bhubaneswar, ev car rental bhubaneswar, best car rental for wedding in bhubaneswar"
        />
        <link rel="canonical" href="https://youngdrives.in/" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Best Car Rental in Bhubaneswar | Young Drives" />
        <meta
          property="og:description"
          content="Rent self-drive and chauffeur cars in Bhubaneswar with zero hassle. Instant airport delivery and 24/7 support at Young Drives."
        />
        <meta property="og:url" content="https://youngdrives.in/" />
        <meta property="og:site_name" content="Young Drives" />
        <meta property="og:image" content="https://youngdrives.in/assets/og-banner.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Car Rental in Bhubaneswar | Young Drives" />
        <meta
          name="twitter:description"
          content="Rent self-drive and chauffeur cars in Bhubaneswar with zero hassle. Affordable rates & 24/7 service."
        />
        <meta name="twitter:image" content="https://youngdrives.in/assets/og-banner.png" />

        {/* Local Business / SEO JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* =================================================
          HOME
      ================================================= */}
      <section id="home" className="home-section home-section--home">
        <HomeVehicle />
      </section>

      {/* =================================================
          POPULAR VEHICLES
      ================================================= */}
      <section id="about" className="home-section home-section--vehicles">
        <HomeMostVechicle />
      </section>

      {/* =================================================
          SERVICES
      ================================================= */}
      <section id="services" className="home-section home-section--services">
        <HeroBestCarRentalSystem />
      </section>

      {/* =================================================
          VEHICLE TYPE
      ================================================= */}
      <section id="type" className="home-section home-section--type">
        <HomeBrowseByType />
      </section>

      {/* =================================================
          CALCULATOR
      ================================================= */}
      <section id="calculator" className="home-section home-section--calculator">
        <HomeCalculate />
      </section>

      {/* =================================================
          PRICING
      ================================================= */}
      <section id="pricing" className="home-section home-section--pricing">
        <HomePriceChart />
      </section>

      {/* =================================================
          FEATURES
      ================================================= */}
      <section id="features" className="home-section home-section--features">
        <HomeFeatureList />
      </section>

      {/* =================================================
          TRUSTED
      ================================================= */}
      <section id="trusted" className="home-section home-section--trusted">
        <HomeTrusted />
      </section>

      {/* =================================================
          TESTIMONIALS
      ================================================= */}
      <section id="testimonials" className="home-section home-section--testimonials">
        <Testimonial />
      </section>
    </main>
  );
};

export default Home;