import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaMapMarkedAlt,
  FaSearch,
  FaHandshake,
  FaUserShield,
} from "react-icons/fa";

const services = [
  {
    icon: <FaHome />,
    title: "Buy Property",
    description:
      "Explore a wide range of verified houses, apartments, and plots available for purchase.",
    link: "/properties",
  },
  {
    icon: <FaBuilding />,
    title: "Rent Property",
    description:
      "Find affordable rental properties including apartments, houses, and commercial spaces.",
    link: "/properties",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Location Based Search",
    description:
      "Search properties by city or location using our advanced location-based filters.",
    link: "/properties",
  },
  {
    icon: <FaSearch />,
    title: "Smart Property Search",
    description:
      "Use advanced filters to find properties by price, size, type, and location.",
    link: "/properties",
  },
  {
    icon: <FaUserShield />,
    title: "Verified Listings",
    description:
      "All properties go through verification to ensure secure and reliable transactions.",
    link: "/about",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-gray-50 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            FindHome provides a complete real estate platform to help you
            search, buy, rent, and manage properties easily.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 group"
            >
              {/* Icon */}
              <div className="text-3xl text-blue-600 mb-4 group-hover:scale-110 transition">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">{service.description}</p>

              {/* Link */}
              <Link
                to={service.link}
                className="text-blue-600 font-medium hover:underline"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;