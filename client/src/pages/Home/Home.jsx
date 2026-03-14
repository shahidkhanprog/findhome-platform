// Home.jsx - Main page that composes all sections together
import React from "react";
import HeroSection from "../../components/home/HeroSection";
import SearchBar from "../../components/home/SearchBar";
import StatsSection from "../../components/home/StatsSection";
import RealEstateServices from "../../components/home/RealEstateServices";
import FeaturedProperties from "../../components/home/FeaturedProperties";
import TestimonialCarousel from "../../components/common/TestimonialCarousel";
import Services from "../../components/common/Services";
import CTA from "../../components/common/CTA";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {

  const { currentUser } = useContext(AuthContext);
  console.log("Current User:", currentUser);

  return (
    <div className="font-sans text-slate-900 bg-white">
      <HeroSection />
      <SearchBar />
      <StatsSection />
      <RealEstateServices />
      <TestimonialCarousel />
      <Services />
      <CTA />
      <FeaturedProperties />
    </div>
  );
};

export default Home;
