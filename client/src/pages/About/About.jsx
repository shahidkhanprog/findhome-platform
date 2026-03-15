// About.jsx - Composes all about page sections
import React from "react";
import AboutHero from "../../components/about/AboutHero";
import BrandStory from "../../components/about/BrandStory";
import ImpactStats from "../../components/about/ImpactStats";
import CoreValues from "../../components/about/CoreValues";
import AboutCTA from "../../components/about/AboutCTA";

const About = () => {
  return (
    <div className="font-sans text-[#101828] bg-white overflow-x-hidden">
      <AboutHero />
      <BrandStory />
      <ImpactStats />
      <CoreValues />
      <AboutCTA />
    </div>
  );
};

export default About;